import type { Coordinate, SafetyFacility } from "../types";
import { RouteModel, type RouteData } from "../models/RouteModel";

export type { RouteData as Route };

// ─── Route Service ────────────────────────────────────────────
// RouteModel을 사용해 안전 경로 계산
export async function findSafeRoutes(
  start: Coordinate,
  end: Coordinate,
  facilities: SafetyFacility[],
): Promise<RouteData[]> {
  // 최단 경로
  const directRoute = await RouteModel.fetchWalkingRoute([start, end]);
  const directAnalysis = RouteModel.analyzeRoute(
    directRoute.points,
    facilities,
  );

  // 안전 경유지 경로
  const safeWaypoint = RouteModel.findSafeWaypoint(start, end, facilities);
  let safeRoute: RouteData | null = null;

  if (safeWaypoint) {
    const waypointRoute = await RouteModel.fetchWalkingRoute([
      start,
      safeWaypoint,
      end,
    ]);
    const waypointAnalysis = RouteModel.analyzeRoute(
      waypointRoute.points,
      facilities,
    );

    safeRoute = {
      points: waypointRoute.points,
      score: waypointAnalysis.score,
      distanceMeters: waypointRoute.distanceMeters,
      durationMinutes: Math.round(waypointRoute.durationSeconds / 60),
      cctvCount: waypointAnalysis.cctvCount,
      bellCount: waypointAnalysis.bellCount,
    };
  }

  const direct: RouteData = {
    points: directRoute.points,
    score: directAnalysis.score,
    distanceMeters: directRoute.distanceMeters,
    durationMinutes: Math.round(directRoute.durationSeconds / 60),
    cctvCount: directAnalysis.cctvCount,
    bellCount: directAnalysis.bellCount,
  };

  const routes = safeRoute ? [direct, safeRoute] : [direct];
  return routes.sort((a, b) => b.score - a.score);
}
