import { create } from "zustand";
import type {
  SafetyFacility,
  SafetyScore,
  FacilityCategory,
  Coordinate,
} from "../types";

// ALL_CATEGORIES에서 streetlight, convenience_store 제거
const ALL_CATEGORIES: FacilityCategory[] = ["cctv", "emergency_bell"];

// ─── 위치 스토어 ───────────────────────────────────────────────
interface LocationStore {
  currentLocation: Coordinate | null;
  setLocation: (coord: Coordinate) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  currentLocation: null,
  setLocation: (coord) => set({ currentLocation: coord }),
}));

// ─── 마커 스토어 ───────────────────────────────────────────────
interface MarkerStore {
  facilities: SafetyFacility[];
  selectedFacility: SafetyFacility | null;
  isLoading: boolean;
  error: string | null;
  setFacilities: (items: SafetyFacility[]) => void;
  selectFacility: (item: SafetyFacility | null) => void;
  setLoading: (val: boolean) => void;
  setError: (msg: string | null) => void;
}

export const useMarkerStore = create<MarkerStore>((set) => ({
  facilities: [],
  selectedFacility: null,
  isLoading: false,
  error: null,
  setFacilities: (items) => set({ facilities: items }),
  selectFacility: (item) => set({ selectedFacility: item }),
  setLoading: (val) => set({ isLoading: val }),
  setError: (msg) => set({ error: msg }),
}));

// ─── 필터 스토어 ───────────────────────────────────────────────
interface FilterStore {
  activeCategories: Set<FacilityCategory>;
  searchRadius: number;
  toggleCategory: (cat: FacilityCategory) => void;
  setAllCategories: (active: boolean) => void;
  setRadius: (meters: number) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  activeCategories: new Set(ALL_CATEGORIES),
  searchRadius: 500,
  toggleCategory: (cat) =>
    set((state) => {
      const next = new Set(state.activeCategories);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return { activeCategories: next };
    }),
  setAllCategories: (active) =>
    set({ activeCategories: active ? new Set(ALL_CATEGORIES) : new Set() }),
  setRadius: (meters) => set({ searchRadius: meters }),
}));

// ─── 안전 점수 스토어 ─────────────────────────────────────────
interface SafetyStore {
  safetyScore: SafetyScore | null;
  setSafetyScore: (score: SafetyScore | null) => void;
}

export const useSafetyStore = create<SafetyStore>((set) => ({
  safetyScore: null,
  setSafetyScore: (score) => set({ safetyScore: score }),
}));
