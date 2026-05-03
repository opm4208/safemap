import type {
  SafetyFacility,
  SafetyScore,
  FacilityCategory,
  Coordinate,
} from "../types";

// 두 좌표 간 거리 계산 (미터)
export function haversineDistance(a: Coordinate, b: Coordinate): number {
  const R = 6_371_000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinHalfDLat = Math.sin(dLat / 2);
  const sinHalfDLng = Math.sin(dLng / 2);
  const a2 =
    sinHalfDLat * sinHalfDLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinHalfDLng * sinHalfDLng;
  return R * 2 * Math.atan2(Math.sqrt(a2), Math.sqrt(1 - a2));
}

// 카테고리별 가중치
// 현재 데이터에 CCTV, 비상벨만 있으므로 두 개로 100점 계산
const WEIGHTS: Record<FacilityCategory, number> = {
  cctv: 60,
  emergency_bell: 40,
};

const FULL_COUNT: Record<FacilityCategory, number> = {
  cctv: 10,
  emergency_bell: 5,
};

function gradeFromScore(score: number): SafetyScore["grade"] {
  if (score >= 80) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  if (score >= 20) return "D";
  return "F";
}

export function calculateSafetyScore(
  center: Coordinate,
  facilities: SafetyFacility[],
  radiusMeters: number,
): SafetyScore {
  // 반경 내 시설만 필터링
  const nearby = facilities.filter(
    (f) => haversineDistance(center, f.coordinate) <= radiusMeters,
  );

  // 카테고리별 시설 수 집계

  const breakdown: Record<FacilityCategory, number> = {
    cctv: 0,
    emergency_bell: 0,
  };
  for (const f of nearby) {
    breakdown[f.category] += 1;
  }

  // 가중 점수 계산
  let score = 0;
  for (const cat of Object.keys(WEIGHTS) as FacilityCategory[]) {
    const ratio = Math.min(breakdown[cat] / FULL_COUNT[cat], 1);
    score += ratio * WEIGHTS[cat];
  }

  return {
    score: Math.round(score),
    grade: gradeFromScore(Math.round(score)),
    breakdown,
    radiusMeters,
  };
}
