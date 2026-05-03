import React from "react";
import type { SafetyFacility } from "../../types";
import { CATEGORY_LABEL, CATEGORY_COLOR } from "../../types";

interface Props {
  facility: SafetyFacility;
  onClose: () => void;
}

export function FacilityDetailPanel({ facility, onClose }: Props) {
  const color = CATEGORY_COLOR[facility.category];

  return (
    <div style={styles.container}>
      {/* 카테고리 뱃지 */}
      <div style={{ ...styles.badge, backgroundColor: color + "22" }}>
        <div style={{ ...styles.dot, backgroundColor: color }} />
        <span style={{ ...styles.badgeText, color }}>
          {CATEGORY_LABEL[facility.category]}
        </span>
      </div>

      {/* 시설 이름 */}
      <h3 style={styles.name}>{facility.name}</h3>

      {/* 24시간 운영 뱃지 */}
      {facility.isOpen24h && (
        <div style={styles.openBadge}>
          <span style={styles.openText}>24시간 운영</span>
        </div>
      )}

      {/* 주소 */}
      <div style={styles.infoRow}>
        <span style={styles.infoIcon}>📍</span>
        <span style={styles.infoText}>
          {facility.address || "주소 정보 없음"}
        </span>
      </div>

      {/* 관리 기관 */}
      <div style={styles.infoRow}>
        <span style={styles.infoIcon}>🏢</span>
        <span style={styles.infoText}>
          {facility.managedBy || "관리 기관 정보 없음"}
        </span>
      </div>

      {/* 닫기 버튼 */}
      <button
        style={{ ...styles.closeBtn, backgroundColor: color }}
        onClick={onClose}
      >
        닫기
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "absolute",
    bottom: 32,
    // 안전 점수 카드 오른쪽에 배치
    left: 256,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: 260,
    boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
    zIndex: 10,
  },
  // 카테고리 뱃지 컨테이너
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px",
    borderRadius: 12,
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
  },
  badgeText: {
    fontSize: 13,
    fontWeight: 600,
  },
  name: {
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
    margin: "0 0 8px 0",
  },
  // 24시간 운영 뱃지
  openBadge: {
    display: "inline-block",
    backgroundColor: "#DCFCE7",
    padding: "3px 10px",
    borderRadius: 10,
    marginBottom: 14,
  },
  openText: {
    fontSize: 12,
    color: "#16A34A",
    fontWeight: 600,
  },
  // 주소 & 관리기관 행
  infoRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 10,
  },
  infoIcon: {
    fontSize: 15,
    flexShrink: 0,
  },
  infoText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 1.5,
  },
  // 닫기 버튼
  closeBtn: {
    width: "100%",
    marginTop: 16,
    padding: "12px 0",
    borderRadius: 12,
    border: "none",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
};
