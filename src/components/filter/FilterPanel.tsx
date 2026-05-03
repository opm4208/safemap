import React from "react";
import { useFilterViewModel } from "../../viewmodels/useFilterViewModel";
import { CATEGORY_LABEL, CATEGORY_COLOR } from "../../types";
import type { FacilityCategory } from "../../types";

const RADIUS_OPTIONS = [300, 500, 1000, 2000] as const;

export function FilterPanel() {
  const {
    searchRadius,
    isAllActive,
    isCategoryActive,
    toggleCategory,
    setAllCategories,
    setRadius,
  } = useFilterViewModel();

  return (
    <div style={styles.container}>
      {/* 헤더 */}
      <div style={styles.header}>
        <span style={styles.title}>🔍 필터</span>
        {/* 전체 선택 토글 */}
        <div
          style={styles.toggleWrap}
          onClick={() => setAllCategories(!isAllActive)}
        >
          <div
            style={{
              ...styles.toggleTrack,
              backgroundColor: isAllActive ? "#3B82F6" : "#D1D5DB",
            }}
          >
            <div
              style={{
                ...styles.toggleThumb,
                transform: isAllActive ? "translateX(16px)" : "translateX(0px)",
              }}
            />
          </div>
          <span style={styles.toggleLabel}>전체</span>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div style={styles.categoryList}>
        {(Object.entries(CATEGORY_LABEL) as [FacilityCategory, string][]).map(
          ([cat, label]) => {
            // ViewModel에서 파생 상태 계산
            const active = isCategoryActive(cat);
            return (
              <div
                key={cat}
                style={styles.categoryRow}
                onClick={() => toggleCategory(cat)}
              >
                {/* 색상 점 */}
                <div
                  style={{
                    ...styles.dot,
                    backgroundColor: active ? CATEGORY_COLOR[cat] : "#D1D5DB",
                  }}
                />
                {/* 라벨 */}
                <span
                  style={{
                    ...styles.categoryLabel,
                    color: active ? "#111827" : "#9CA3AF",
                  }}
                >
                  {label}
                </span>
                {/* 토글 스위치 */}
                <div
                  style={{
                    ...styles.toggleTrack,
                    backgroundColor: active ? CATEGORY_COLOR[cat] : "#D1D5DB",
                  }}
                >
                  <div
                    style={{
                      ...styles.toggleThumb,
                      transform: active
                        ? "translateX(16px)"
                        : "translateX(0px)",
                    }}
                  />
                </div>
              </div>
            );
          },
        )}
      </div>

      {/* 구분선 */}
      <div style={styles.divider} />

      {/* 반경 설정 */}
      <p style={styles.sectionLabel}>검색 반경</p>
      <div style={styles.radiusRow}>
        {RADIUS_OPTIONS.map((r) => (
          <button
            key={r}
            onClick={() => setRadius(r)}
            style={{
              ...styles.radiusBtn,
              backgroundColor: searchRadius === r ? "#3B82F6" : "#F3F4F6",
              color: searchRadius === r ? "#fff" : "#6B7280",
              fontWeight: searchRadius === r ? 700 : 400,
            }}
          >
            {r >= 1000 ? `${r / 1000}km` : `${r}m`}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: "16px",
    width: 210,
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
    zIndex: 10,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: "#111827",
  },
  categoryList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  categoryRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    flexShrink: 0,
    transition: "background-color 0.2s",
  },
  categoryLabel: {
    fontSize: 14,
    flex: 1,
    transition: "color 0.2s",
  },
  // 토글 스위치 트랙
  toggleTrack: {
    width: 36,
    height: 20,
    borderRadius: 10,
    position: "relative",
    cursor: "pointer",
    transition: "background-color 0.2s",
    flexShrink: 0,
  },
  // 토글 스위치 썸
  toggleThumb: {
    position: "absolute",
    top: 2,
    left: 2,
    width: 16,
    height: 16,
    borderRadius: "50%",
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    transition: "transform 0.2s",
  },
  toggleWrap: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
  },
  toggleLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    margin: "12px 0",
  },
  sectionLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    margin: "0 0 8px 0",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  radiusRow: {
    display: "flex",
    gap: 6,
  },
  radiusBtn: {
    flex: 1,
    padding: "6px 0",
    borderRadius: 10,
    border: "none",
    fontSize: 12,
    cursor: "pointer",
    transition: "all 0.2s",
  },
};
