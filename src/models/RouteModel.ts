import type { Coordinate, SafetyFacility } from "../types";
import { haversineDistance } from "./SafetyCalculator";

// ─── Route Model ──────────────────────────────────────────────
// 경로 계산 비즈니스 로직 담당
export interface RouteData {
  points: Coordinate[];
  score: number;
  distanceMeters: number;
  durationMinutes: number;
  cctvCount: number;
  bellCount: number;
}

export const RouteModel = {
  // ─── OSRM 도보 경로 API 호출 ────────────────────────────────
  async fetchWalkingRoute(
    coordinates: Coordinate[],
  ): Promise<{
    points: Coordinate[];
    distanceMeters: number;
    durationSeconds: number;
  }> {
    const coordStr = coordinates.map((c) => `${c.lng},${c.lat}`).join(";");

    const isProduction = process.env.NODE_ENV === "production";

    // 개발: 직접 호출, 배포: Vercel API Route 사용
    const url = isProduction
      ? `/api/osrm?coords=${coordStr}`
      : `https://router.project-osrm.org/route/v1/foot/${coordStr}?overview=full&geometries=geojson`;

    const res = await fetch(url);
    const data = await res.json();
    const route = data?.routes?.[0];
    const coords: number[][] = route?.geometry?.coordinates ?? [];

    return {
      points: coords.map((c) => ({ lng: c[0], lat: c[1] })),
      distanceMeters: Math.round(route?.distance ?? 0),
      durationSeconds: Math.round(route?.duration ?? 0),
    };
  },

  // ─── 경로상 안전 점수 및 시설 수 계산 ───────────────────────
  // 경로 각 지점 주변 50m 내 시설 수집 (중복 제거)
  analyzeRoute(
    points: Coordinate[],
    facilities: SafetyFacility[],
  ): { score: number; cctvCount: number; bellCount: number } {
    if (points.length === 0) return { score: 0, cctvCount: 0, bellCount: 0 };

    const nearbyCctv = new Set<string>();
    const nearbyBell = new Set<string>();

    points.forEach((point) => {
      facilities.forEach((f) => {
        if (haversineDistance(point, f.coordinate) <= 50) {
          if (f.category === "cctv") nearbyCctv.add(f.id);
          if (f.category === "emergency_bell") nearbyBell.add(f.id);
        }
      });
    });

    const cctvCount = nearbyCctv.size;
    const bellCount = nearbyBell.size;

    // CCTV 60점, 비상벨 40점 기준으로 점수 계산
    const score = Math.round(
      Math.min(cctvCount / 5, 1) * 60 + Math.min(bellCount / 3, 1) * 40,
    );

    return { score, cctvCount, bellCount };
  },

  // ─── 안전 경유지 찾기 ────────────────────────────────────────
  // 출발지~목적지 직선 위에 가까우면서 안전 시설이 밀집된 지점 선택
  findSafeWaypoint(
    start: Coordinate,
    end: Coordinate,
    facilities: SafetyFacility[],
  ): Coordinate | null {
    // 직선으로부터 거리 계산
    function distFromLine(point: Coordinate): number {
      const dx = end.lng - start.lng;
      const dy = end.lat - start.lat;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len === 0) return haversineDistance(start, point);
      const t =
        ((point.lng - start.lng) * dx + (point.lat - start.lat) * dy) /
        (len * len);
      // t가 0.1~0.9 사이여야 출발지~목적지 중간에 있는 것
      if (t < 0.1 || t > 0.9) return Infinity;
      const closestLng = start.lng + t * dx;
      const closestLat = start.lat + t * dy;
      return haversineDistance(point, { lat: closestLat, lng: closestLng });
    }

    // 직선에서 200m 이내 시설만 후보로
    const candidates = facilities.filter((f) => {
      const lineDistMeters = distFromLine(f.coordinate) * 111320;
      return lineDistMeters < 200;
    });

    if (candidates.length === 0) return null;

    // 후보 중 주변 100m 내 시설이 가장 많은 지점 선택
    let bestFacility: SafetyFacility | null = null;
    let bestCount = 0;

    candidates.forEach((f) => {
      const nearbyCount = facilities.filter(
        (other) => haversineDistance(f.coordinate, other.coordinate) <= 100,
      ).length;
      if (nearbyCount > bestCount) {
        bestCount = nearbyCount;
        bestFacility = f;
      }
    });

    if (!bestFacility) return null;
    return (bestFacility as SafetyFacility).coordinate;
  },
};
