import { FilterModel } from "./FilterModel";

describe("FilterModel", () => {
  // ─── isAllActive 테스트 ─────────────────────────────────────
  describe("isAllActive", () => {
    test("모든 카테고리가 활성화되면 true 반환", () => {
      const active = new Set(["cctv", "emergency_bell"] as const);
      expect(FilterModel.isAllActive(active)).toBe(true);
    });

    test("일부 카테고리만 활성화되면 false 반환", () => {
      const active = new Set(["cctv"] as const);
      expect(FilterModel.isAllActive(active)).toBe(false);
    });

    test("빈 세트면 false 반환", () => {
      const active = new Set([] as const);
      expect(FilterModel.isAllActive(active)).toBe(false);
    });
  });

  // ─── isValidRadius 테스트 ───────────────────────────────────
  describe("isValidRadius", () => {
    test("유효한 반경이면 true 반환", () => {
      expect(FilterModel.isValidRadius(300)).toBe(true);
      expect(FilterModel.isValidRadius(500)).toBe(true);
      expect(FilterModel.isValidRadius(1000)).toBe(true);
      expect(FilterModel.isValidRadius(2000)).toBe(true);
    });

    test("유효하지 않은 반경이면 false 반환", () => {
      expect(FilterModel.isValidRadius(100)).toBe(false);
      expect(FilterModel.isValidRadius(999)).toBe(false);
      expect(FilterModel.isValidRadius(3000)).toBe(false);
    });
  });

  // ─── setAllCategories 테스트 ────────────────────────────────
  describe("setAllCategories", () => {
    test("true면 모든 카테고리 활성화", () => {
      const result = FilterModel.setAllCategories(true);
      expect(result.has("cctv")).toBe(true);
      expect(result.has("emergency_bell")).toBe(true);
    });

    test("false면 빈 세트 반환", () => {
      const result = FilterModel.setAllCategories(false);
      expect(result.size).toBe(0);
    });
  });

  // ─── toggleCategory 테스트 ──────────────────────────────────
  describe("toggleCategory", () => {
    test("비활성 카테고리 토글하면 활성화", () => {
      const active = new Set(["cctv"] as const);
      const result = FilterModel.toggleCategory(active, "emergency_bell");
      expect(result.has("emergency_bell")).toBe(true);
    });

    test("활성 카테고리 토글하면 비활성화", () => {
      const active = new Set(["cctv", "emergency_bell"] as const);
      const result = FilterModel.toggleCategory(active, "cctv");
      expect(result.has("cctv")).toBe(false);
    });
  });
});
