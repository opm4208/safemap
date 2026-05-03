import type { Coordinate } from "../types";

// ─── Location Model ───────────────────────────────────────────
// 위치 데이터 관리 및 GPS 관련 비즈니스 로직 담당
export interface LocationData {
  coordinate: Coordinate;
  isManual: boolean; // 수동 설정 여부
}

export const LocationModel = {
  // GPS 위치 유효성 검사
  isValidCoordinate(coord: Coordinate): boolean {
    return (
      coord.lat >= -90 &&
      coord.lat <= 90 &&
      coord.lng >= -180 &&
      coord.lng <= 180
    );
  },

  // 두 좌표가 같은지 비교
  isSameLocation(a: Coordinate, b: Coordinate): boolean {
    const THRESHOLD = 0.0001;
    return (
      Math.abs(a.lat - b.lat) < THRESHOLD && Math.abs(a.lng - b.lng) < THRESHOLD
    );
  },
};
