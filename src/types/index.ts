// 현재 데이터에 있는 카테고리만 사용
export type FacilityCategory = "cctv" | "emergency_bell";

export const CATEGORY_LABEL: Record<FacilityCategory, string> = {
  cctv: "CCTV",
  emergency_bell: "비상벨",
};

export const CATEGORY_COLOR: Record<FacilityCategory, string> = {
  cctv: "#3B82F6", // 파랑
  emergency_bell: "#EF4444", // 빨강
};

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface SafetyFacility {
  id: string;
  category: FacilityCategory;
  name: string;
  address: string;
  managedBy: string;
  coordinate: Coordinate;
  isOpen24h?: boolean;
}

export interface SafetyScore {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  breakdown: Record<FacilityCategory, number>;
  radiusMeters: number;
}

export interface FilterState {
  activeCategories: Set<FacilityCategory>;
  searchRadius: number;
}
