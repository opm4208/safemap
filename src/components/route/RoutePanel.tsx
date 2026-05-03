import React from "react";

interface Props {
  onSelectStart: () => void;
  onSelectEnd: () => void;
  onFindRoute: () => void;
  onClear: () => void;
  startSet: boolean;
  endSet: boolean;
  isCalculating: boolean;
  safetyScore: number | null;
  routeDistance: number | null;
  routeDuration: number | null;
  cctvCount: number | null;
  bellCount: number | null;
}

export function RoutePanel({
  onSelectStart,
  onSelectEnd,
  onFindRoute,
  onClear,
  startSet,
  endSet,
  isCalculating,
  safetyScore,
  routeDistance,
  routeDuration,
  cctvCount,
  bellCount,
}: Props) {
  const scoreColor =
    safetyScore === null
      ? "#6B7280"
      : safetyScore >= 60
        ? "#10B981"
        : safetyScore >= 40
          ? "#F59E0B"
          : "#EF4444";

  const scoreLabel =
    safetyScore === null
      ? ""
      : safetyScore >= 60
        ? "안전한 경로"
        : safetyScore >= 40
          ? "보통 경로"
          : "주의 필요";

  return (
    <div style={styles.container}>
      {/* 헤더 */}
      <p style={styles.title}>🏠 안전 귀갓길</p>

      {/* 출발지/목적지 설정 버튼 */}
      <div style={styles.pointRow}>
        {/* 출발지 */}
        <div
          style={{
            ...styles.pointBtn,
            borderColor: startSet ? "#10B981" : "#E5E7EB",
            backgroundColor: startSet ? "#ECFDF5" : "#F9FAFB",
          }}
          onClick={onSelectStart}
        >
          <div
            style={{
              ...styles.pointDot,
              backgroundColor: startSet ? "#10B981" : "#D1D5DB",
            }}
          />
          <span
            style={{
              ...styles.pointLabel,
              color: startSet ? "#10B981" : "#9CA3AF",
            }}
          >
            {startSet ? "출발지 ✓" : "출발지 설정"}
          </span>
        </div>

        {/* 화살표 */}
        <span style={styles.arrow}>→</span>

        {/* 목적지 */}
        <div
          style={{
            ...styles.pointBtn,
            borderColor: endSet ? "#EF4444" : "#E5E7EB",
            backgroundColor: endSet ? "#FEF2F2" : "#F9FAFB",
            opacity: startSet ? 1 : 0.5,
            cursor: startSet ? "pointer" : "not-allowed",
          }}
          onClick={startSet ? onSelectEnd : undefined}
        >
          <div
            style={{
              ...styles.pointDot,
              backgroundColor: endSet ? "#EF4444" : "#D1D5DB",
            }}
          />
          <span
            style={{
              ...styles.pointLabel,
              color: endSet ? "#EF4444" : "#9CA3AF",
            }}
          >
            {endSet ? "목적지 ✓" : "목적지 설정"}
          </span>
        </div>
      </div>

      {/* 경로 찾기 버튼 */}
      {startSet && endSet && (
        <button
          style={{
            ...styles.findBtn,
            backgroundColor: isCalculating ? "#9CA3AF" : "#3B82F6",
          }}
          onClick={onFindRoute}
          disabled={isCalculating}
        >
          {isCalculating ? "⏳ 경로 계산 중..." : "🔍 안전 경로 찾기"}
        </button>
      )}

      {/* 경로 분석 결과 */}
      {safetyScore !== null && (
        <div style={styles.resultBox}>
          {/* 점수 행 */}
          <div style={styles.scoreRow}>
            <div
              style={{
                ...styles.scoreCircle,
                borderColor: scoreColor,
                backgroundColor: scoreColor + "15",
              }}
            >
              <span style={{ ...styles.scoreNum, color: scoreColor }}>
                {safetyScore}
              </span>
              <span
                style={{ fontSize: 10, color: scoreColor, fontWeight: 600 }}
              >
                점
              </span>
            </div>
            <div>
              <p style={{ ...styles.scoreLabel, color: scoreColor }}>
                {scoreLabel}
              </p>
              {routeDistance !== null && (
                <p style={styles.routeInfo}>
                  {routeDistance >= 1000
                    ? `${(routeDistance / 1000).toFixed(1)}km`
                    : `${routeDistance}m`}
                  {routeDuration !== null && ` · 약 ${routeDuration}분`}
                </p>
              )}
            </div>
          </div>

          {/* 게이지 바 */}
          <div style={styles.gaugeTrack}>
            <div
              style={{
                ...styles.gaugeFill,
                width: `${safetyScore}%`,
                backgroundColor: scoreColor,
              }}
            />
          </div>

          {/* 시설 수 */}
          <div style={styles.facilityRow}>
            <div style={styles.facilityItem}>
              <div
                style={{ ...styles.facilityDot, backgroundColor: "#3B82F6" }}
              />
              <span style={styles.facilityLabel}>CCTV</span>
              <span style={styles.facilityCount}>{cctvCount}개</span>
            </div>
            <div style={styles.facilityDivider} />
            <div style={styles.facilityItem}>
              <div
                style={{ ...styles.facilityDot, backgroundColor: "#EF4444" }}
              />
              <span style={styles.facilityLabel}>비상벨</span>
              <span style={styles.facilityCount}>{bellCount}개</span>
            </div>
          </div>
        </div>
      )}

      {/* 초기화 버튼 */}
      {(startSet || endSet) && (
        <button style={styles.clearBtn} onClick={onClear}>
          초기화
        </button>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    width: 240,
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  pointRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  pointBtn: {
    flex: 1,
    padding: "8px 6px",
    borderRadius: 10,
    border: "1.5px solid",
    display: "flex",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  pointDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
  pointLabel: {
    fontSize: 11,
    fontWeight: 600,
  },
  arrow: {
    fontSize: 14,
    color: "#9CA3AF",
    flexShrink: 0,
  },
  findBtn: {
    padding: "11px 0",
    borderRadius: 12,
    border: "none",
    color: "#fff",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
  },
  resultBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  scoreRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  scoreCircle: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    border: "3px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column" as const,
    flexShrink: 0,
  },
  scoreNum: {
    fontSize: 18,
    fontWeight: 800,
    lineHeight: 1,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: 700,
    margin: "0 0 3px 0",
  },
  routeInfo: {
    fontSize: 12,
    color: "#6B7280",
    margin: 0,
  },
  gaugeTrack: {
    height: 5,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
  },
  gaugeFill: {
    height: 5,
    borderRadius: 3,
    transition: "width 0.8s ease",
  },
  facilityRow: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: "8px 12px",
  },
  facilityItem: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  facilityDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#E5E7EB",
    margin: "0 8px",
  },
  facilityDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
  facilityLabel: {
    fontSize: 12,
    color: "#6B7280",
    flex: 1,
  },
  facilityCount: {
    fontSize: 13,
    fontWeight: 700,
    color: "#111827",
  },
  clearBtn: {
    padding: "8px 0",
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    backgroundColor: "#fff",
    color: "#9CA3AF",
    fontSize: 13,
    cursor: "pointer",
    width: "100%",
  },
};
