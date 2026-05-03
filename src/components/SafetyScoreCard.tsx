import React from "react";
import type { SafetyScore } from "../types";
import { CATEGORY_LABEL, CATEGORY_COLOR } from "../types";

interface Props {
  score: SafetyScore;
}

const GRADE_COLOR = {
  A: "#10B981",
  B: "#3B82F6",
  C: "#F59E0B",
  D: "#F97316",
  F: "#EF4444",
} as const;

const GRADE_LABEL = {
  A: "매우 안전",
  B: "안전",
  C: "보통",
  D: "주의",
  F: "위험",
} as const;

export function SafetyScoreCard({ score }: Props) {
  const color = GRADE_COLOR[score.grade];

  return (
    <div style={styles.card}>
      {/* 제목 */}
      <p style={styles.title}>내 주변 안전 점수</p>

      {/* 점수 영역 */}
      <div style={styles.scoreRow}>
        {/* 등급 원형 뱃지 */}
        <div
          style={{
            ...styles.gradeCircle,
            borderColor: color,
            backgroundColor: color + "15",
          }}
        >
          <span style={{ ...styles.gradeText, color }}>{score.grade}</span>
        </div>

        <div style={styles.scoreInfo}>
          <span style={{ ...styles.scoreNum, color }}>{score.score}점</span>
          <span style={{ ...styles.scoreLabel, color }}>
            {GRADE_LABEL[score.grade]}
          </span>
          <span style={styles.radiusText}>반경 {score.radiusMeters}m 기준</span>
        </div>
      </div>

      {/* 게이지 바 */}
      <div style={styles.gaugeTrack}>
        <div
          style={{
            ...styles.gaugeFill,
            width: `${score.score}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {/* 구분선 */}
      <div style={styles.divider} />

      {/* 카테고리별 현황 */}
      <div style={styles.breakdown}>
        {(
          Object.entries(score.breakdown) as [
            keyof typeof score.breakdown,
            number,
          ][]
        ).map(([cat, count]) => (
          <div key={cat} style={styles.breakdownItem}>
            <div
              style={{
                ...styles.breakdownDot,
                backgroundColor: CATEGORY_COLOR[cat],
              }}
            />
            <span style={styles.catLabel}>{CATEGORY_LABEL[cat]}</span>
            <span style={styles.catCount}>{count}개</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    position: "absolute",
    bottom: 32,
    left: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    width: 210,
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
    zIndex: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: 600,
    color: "#9CA3AF",
    margin: "0 0 12px 0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  scoreRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  gradeCircle: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    border: "3px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  gradeText: {
    fontSize: 22,
    fontWeight: 800,
  },
  scoreInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  scoreNum: {
    fontSize: 22,
    fontWeight: 800,
    lineHeight: 1,
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: 600,
  },
  radiusText: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  gaugeTrack: {
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 12,
  },
  gaugeFill: {
    height: 6,
    borderRadius: 3,
    transition: "width 0.8s ease",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    margin: "0 0 10px 0",
  },
  breakdown: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  breakdownItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
  catLabel: {
    fontSize: 13,
    color: "#6B7280",
    flex: 1,
  },
  catCount: {
    fontSize: 13,
    fontWeight: 700,
    color: "#111827",
  },
};
