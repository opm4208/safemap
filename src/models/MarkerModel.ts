import type { SafetyFacility, FacilityCategory, Coordinate } from "../types";
import { haversineDistance } from "../models/SafetyCalculator";
export {};
// ─── Marker Model ─────────────────────────────────────────────
// 시설물 데이터 관리 및 필터링 비즈니스 로직 담당
export const MarkerModel = {
  // 카테고리로 필터링
  filterByCategories(
    facilities: SafetyFacility[],
    activeCategories: Set<FacilityCategory>,
  ): SafetyFacility[] {
    return facilities.filter((f) => activeCategories.has(f.category));
  },

  // 반경 내 시설물 필터링
  filterByRadius(
    facilities: SafetyFacility[],
    center: Coordinate,
    radiusMeters: number,
  ): SafetyFacility[] {
    return facilities.filter(
      (f) => haversineDistance(center, f.coordinate) <= radiusMeters,
    );
  },

  // 카테고리별 시설물 수 집계
  countByCategory(
    facilities: SafetyFacility[],
  ): Record<FacilityCategory, number> {
    return facilities.reduce(
      (acc, f) => {
        acc[f.category] = (acc[f.category] ?? 0) + 1;
        return acc;
      },
      {} as Record<FacilityCategory, number>,
    );
  },
};
