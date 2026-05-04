import { SafetyModel } from "./SafetyModel";
import type { SafetyFacility, Coordinate } from "../types";

// ─── 테스트용 더미 데이터 ─────────────────────────────────────
const mockFacilities: SafetyFacility[] = [
  {
    id: "cctv-1",
    category: "cctv",
    name: "테스트 CCTV 1",
    address: "서울시 종로구",
    managedBy: "종로구청",
    coordinate: { lat: 37.5665, lng: 126.978 },
  },
  {
    id: "cctv-2",
    category: "cctv",
    name: "테스트 CCTV 2",
    address: "서울시 종로구",
    managedBy: "종로구청",
    coordinate: { lat: 37.5666, lng: 126.978 },
  },
  {
    id: "bell-1",
    category: "emergency_bell",
    name: "테스트 비상벨",
    address: "서울시 종로구",
    managedBy: "경찰청",
    coordinate: { lat: 37.5667, lng: 126.978 },
  },
];

const center: Coordinate = { lat: 37.5665, lng: 126.978 };

describe("SafetyModel", () => {
  // ─── getGrade 테스트 ────────────────────────────────────────
  describe("getGrade", () => {
    test("80점 이상이면 A등급", () => {
      expect(SafetyModel.getGrade(80)).toBe("A");
      expect(SafetyModel.getGrade(100)).toBe("A");
    });

    test("60~79점이면 B등급", () => {
      expect(SafetyModel.getGrade(60)).toBe("B");
      expect(SafetyModel.getGrade(79)).toBe("B");
    });

    test("40~59점이면 C등급", () => {
      expect(SafetyModel.getGrade(40)).toBe("C");
      expect(SafetyModel.getGrade(59)).toBe("C");
    });

    test("20~39점이면 D등급", () => {
      expect(SafetyModel.getGrade(20)).toBe("D");
      expect(SafetyModel.getGrade(39)).toBe("D");
    });

    test("20점 미만이면 F등급", () => {
      expect(SafetyModel.getGrade(0)).toBe("F");
      expect(SafetyModel.getGrade(19)).toBe("F");
    });
  });

  // ─── calculateScore 테스트 ──────────────────────────────────
  describe("calculateScore", () => {
    test("반경 내 시설물이 있으면 점수가 0보다 커야 함", () => {
      const score = SafetyModel.calculateScore(center, mockFacilities, 500);
      expect(score.score).toBeGreaterThan(0);
    });

    test("반경 내 시설물이 없으면 점수가 0이어야 함", () => {
      const farCenter: Coordinate = { lat: 35.0, lng: 126.0 };
      const score = SafetyModel.calculateScore(farCenter, mockFacilities, 500);
      expect(score.score).toBe(0);
      expect(score.grade).toBe("F");
    });

    test("반환값에 필요한 속성이 모두 있어야 함", () => {
      const score = SafetyModel.calculateScore(center, mockFacilities, 500);
      expect(score).toHaveProperty("score");
      expect(score).toHaveProperty("grade");
      expect(score).toHaveProperty("breakdown");
      expect(score).toHaveProperty("radiusMeters");
    });

    test("radiusMeters가 입력값과 동일해야 함", () => {
      const score = SafetyModel.calculateScore(center, mockFacilities, 300);
      expect(score.radiusMeters).toBe(300);
    });

    test("점수는 0~100 사이여야 함", () => {
      const score = SafetyModel.calculateScore(center, mockFacilities, 500);
      expect(score.score).toBeGreaterThanOrEqual(0);
      expect(score.score).toBeLessThanOrEqual(100);
    });

    test("breakdown에 cctv, emergency_bell 개수가 포함되어야 함", () => {
      const score = SafetyModel.calculateScore(center, mockFacilities, 500);
      expect(score.breakdown).toHaveProperty("cctv");
      expect(score.breakdown).toHaveProperty("emergency_bell");
    });
  });
});
