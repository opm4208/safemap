import type {
  SafetyFacility,
  SafetyScore,
  FacilityCategory,
  Coordinate,
} from "../types";
import { haversineDistance } from "../models/SafetyCalculator";

// ─── Safety Model ─────────────────────────────────────────────
// 안전 점수 계산 비즈니스 로직 담당
const WEIGHTS: Record<FacilityCategory, number> = {
  cctv: 60,
  emergency_bell: 40,
};

const FULL_COUNT: Record<FacilityCategory, number> = {
  cctv: 10,
  emergency_bell: 5,
};

export const SafetyModel = {
  // 안전 등급 계산
  getGrade(score: number): SafetyScore["grade"] {
    if (score >= 80) return "A";
    if (score >= 60) return "B";
    if (score >= 40) return "C";
    if (score >= 20) return "D";
    return "F";
  },

  // 안전 점수 계산
  calculateScore(
    center: Coordinate,
    facilities: SafetyFacility[],
    radiusMeters: number,
  ): SafetyScore {
    const nearby = facilities.filter(
      (f) => haversineDistance(center, f.coordinate) <= radiusMeters,
    );

    const breakdown: Record<FacilityCategory, number> = {
      cctv: 0,
      emergency_bell: 0,
    };

    for (const f of nearby) {
      breakdown[f.category] += 1;
    }

    let score = 0;
    for (const cat of Object.keys(WEIGHTS) as FacilityCategory[]) {
      const ratio = Math.min(breakdown[cat] / FULL_COUNT[cat], 1);
      score += ratio * WEIGHTS[cat];
    }

    const finalScore = Math.round(score);

    return {
      score: finalScore,
      grade: this.getGrade(finalScore),
      breakdown,
      radiusMeters,
    };
  },
};
