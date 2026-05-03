import type { FacilityCategory } from "../types";

// ─── Filter Model ─────────────────────────────────────────────
// 필터 상태 관련 비즈니스 로직 담당
export const ALL_CATEGORIES: FacilityCategory[] = ["cctv", "emergency_bell"];

export const RADIUS_OPTIONS = [300, 500, 1000, 2000] as const;

export const FilterModel = {
  // 전체 선택 여부 확인
  isAllActive(activeCategories: Set<FacilityCategory>): boolean {
    return activeCategories.size === ALL_CATEGORIES.length;
  },

  // 카테고리 토글
  toggleCategory(
    activeCategories: Set<FacilityCategory>,
    cat: FacilityCategory,
  ): Set<FacilityCategory> {
    const next = new Set(activeCategories);
    next.has(cat) ? next.delete(cat) : next.add(cat);
    return next;
  },

  // 전체 선택/해제
  setAllCategories(active: boolean): Set<FacilityCategory> {
    return active ? new Set(ALL_CATEGORIES) : new Set();
  },

  // 반경 유효성 검사
  isValidRadius(radius: number): boolean {
    return (RADIUS_OPTIONS as readonly number[]).includes(radius);
  },
};
