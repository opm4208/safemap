import { MarkerModel } from "./MarkerModel";
import type { SafetyFacility, Coordinate } from "../types";

// ─── 테스트용 더미 데이터 ─────────────────────────────────────
const mockFacilities: SafetyFacility[] = [
  {
    id: "cctv-1",
    category: "cctv",
    name: "CCTV 1",
    address: "서울시 종로구",
    managedBy: "종로구청",
    coordinate: { lat: 37.5665, lng: 126.978 },
  },
  {
    id: "cctv-2",
    category: "cctv",
    name: "CCTV 2",
    address: "서울시 종로구",
    managedBy: "종로구청",
    coordinate: { lat: 37.5666, lng: 126.978 },
  },
  {
    id: "bell-1",
    category: "emergency_bell",
    name: "비상벨 1",
    address: "서울시 종로구",
    managedBy: "경찰청",
    coordinate: { lat: 37.5667, lng: 126.978 },
  },
];

const center: Coordinate = { lat: 37.5665, lng: 126.978 };

describe("MarkerModel", () => {
  // ─── filterByCategories 테스트 ──────────────────────────────
  describe("filterByCategories", () => {
    test("CCTV만 필터링하면 CCTV만 반환되어야 함", () => {
      const result = MarkerModel.filterByCategories(
        mockFacilities,
        new Set(["cctv"] as const),
      );
      expect(result).toHaveLength(2);
      expect(result.every((f) => f.category === "cctv")).toBe(true);
    });

    test("비상벨만 필터링하면 비상벨만 반환되어야 함", () => {
      const result = MarkerModel.filterByCategories(
        mockFacilities,
        new Set(["emergency_bell"] as const),
      );
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe("emergency_bell");
    });

    test("빈 카테고리면 빈 배열 반환", () => {
      const result = MarkerModel.filterByCategories(
        mockFacilities,
        new Set([] as const),
      );
      expect(result).toHaveLength(0);
    });

    test("전체 카테고리면 전체 반환", () => {
      const result = MarkerModel.filterByCategories(
        mockFacilities,
        new Set(["cctv", "emergency_bell"] as const),
      );
      expect(result).toHaveLength(3);
    });
  });

  // ─── filterByRadius 테스트 ──────────────────────────────────
  describe("filterByRadius", () => {
    test("반경 내 시설물만 반환되어야 함", () => {
      const result = MarkerModel.filterByRadius(mockFacilities, center, 500);
      expect(result.length).toBeGreaterThan(0);
    });

    test("반경 밖 시설물은 반환되지 않아야 함", () => {
      const farCenter: Coordinate = { lat: 35.0, lng: 126.0 };
      const result = MarkerModel.filterByRadius(mockFacilities, farCenter, 500);
      expect(result).toHaveLength(0);
    });
  });

  // ─── countByCategory 테스트 ─────────────────────────────────
  describe("countByCategory", () => {
    test("카테고리별 개수가 올바르게 집계되어야 함", () => {
      const result = MarkerModel.countByCategory(mockFacilities);
      expect(result.cctv).toBe(2);
      expect(result.emergency_bell).toBe(1);
    });

    test("빈 배열이면 모든 카테고리 개수가 0이어야 함", () => {
      const result = MarkerModel.countByCategory([]);
      expect(Object.values(result).every((v) => v === 0)).toBe(true);
    });
  });
});
