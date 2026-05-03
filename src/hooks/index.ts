import { useEffect, useCallback, useRef } from "react";
import {
  useLocationStore,
  useMarkerStore,
  useFilterStore,
  useSafetyStore,
} from "../store";
import { PublicDataService } from "../services/PublicDataService";
import { calculateSafetyScore } from "../models/SafetyCalculator";
import { useMarkerViewModel } from "../viewmodels/useMarkerViewModel";

// ─── 위치 추적 훅 ─────────────────────────────────────────────
// GPS 위치 추적, 수동 위치 설정, GPS 복원 담당
export function useLocation() {
  const { currentLocation, setLocation } = useLocationStore();
  const isManualRef = useRef(false);
  const gpsLocationRef = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coord = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        gpsLocationRef.current = coord;
        if (isManualRef.current) return;
        setLocation(coord);
      },
      (err) => console.warn("위치 오류:", err.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coord = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        gpsLocationRef.current = coord;
        if (isManualRef.current) return;
        setLocation(coord);
      },
      (err) => console.warn("위치 추적 오류:", err.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [setLocation]);

  // 수동으로 위치 설정
  const setManualLocation = (coord: { lat: number; lng: number }) => {
    isManualRef.current = true;
    setLocation(coord);
  };

  // GPS 위치로 복원
  const resetToGPS = () => {
    isManualRef.current = false;
    if (gpsLocationRef.current) {
      setLocation(gpsLocationRef.current);
    }
  };

  return { currentLocation, setManualLocation, resetToGPS };
}

// ─── 시설물 데이터 로드 훅 ────────────────────────────────────
// 공공데이터 API 호출, 최초 1회만 로드
export function useMarkers() {
  const { currentLocation } = useLocationStore();
  const { facilities, isLoading, error, setFacilities, setLoading, setError } =
    useMarkerStore();
  const { searchRadius } = useFilterStore();
  const loadedRef = useRef(false);

  const loadFacilities = useCallback(async () => {
    if (!currentLocation) return;
    if (loadedRef.current) return;

    setLoading(true);
    setError(null);
    try {
      const items = await PublicDataService.fetchAllFacilities(
        currentLocation,
        searchRadius,
      );
      setFacilities(items);
      loadedRef.current = true;
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [currentLocation, searchRadius, setFacilities, setLoading, setError]);

  useEffect(() => {
    loadFacilities();
  }, [loadFacilities]);

  return { facilities, isLoading, error, reload: loadFacilities };
}

// ─── 필터링된 시설물 훅 ───────────────────────────────────────
// useMarkerViewModel에서 필터링된 시설물만 반환
export function useFilteredFacilities() {
  const { filteredFacilities } = useMarkerViewModel();
  return filteredFacilities;
}

// ─── 안전 점수 계산 훅 ────────────────────────────────────────
// 현재 위치 주변 안전 점수 계산
export function useSafetyScore() {
  const { currentLocation } = useLocationStore();
  const { facilities } = useMarkerStore();
  const { searchRadius } = useFilterStore();
  const { safetyScore, setSafetyScore } = useSafetyStore();

  useEffect(() => {
    if (!currentLocation || facilities.length === 0) return;
    const score = calculateSafetyScore(
      currentLocation,
      facilities,
      searchRadius,
    );
    setSafetyScore(score);
  }, [currentLocation, facilities, searchRadius, setSafetyScore]);

  return safetyScore;
}
