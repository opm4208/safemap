import { useFilterStore } from "../store";
import { FilterModel } from "../models/FilterModel";
import type { FacilityCategory } from "../types";

// ─── Filter ViewModel ─────────────────────────────────────────
// FilterModel의 비즈니스 로직을 활용해 View에 필터 상태 전달
export function useFilterViewModel() {
  const {
    activeCategories,
    searchRadius,
    toggleCategory,
    setAllCategories,
    setRadius,
  } = useFilterStore();

  // Model에서 파생 상태 계산
  const isAllActive = FilterModel.isAllActive(activeCategories);
  const isCategoryActive = (cat: FacilityCategory) => activeCategories.has(cat);

  return {
    activeCategories,
    searchRadius,
    isAllActive,
    isCategoryActive,
    toggleCategory,
    setAllCategories,
    setRadius,
  };
}
