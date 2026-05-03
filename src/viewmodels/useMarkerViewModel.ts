import { useEffect, useCallback, useMemo, useRef } from "react";
import { useLocationStore, useMarkerStore, useFilterStore } from "../store";
import { PublicDataService } from "../services/PublicDataService";
import { MarkerModel } from "../models/MarkerModel";

// ─── Marker ViewModel ─────────────────────────────────────────
// MarkerModel을 사용해 시설물 데이터 로드 및 필터링 후 View에 전달
export function useMarkerViewModel() {
  const { currentLocation } = useLocationStore();
  const { facilities, isLoading, error, setFacilities, setLoading, setError } =
    useMarkerStore();
  const { activeCategories, searchRadius } = useFilterStore();
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

  // Model에서 필터링 로직 담당
  const filteredFacilities = useMemo(
    () => MarkerModel.filterByCategories(facilities, activeCategories),
    [facilities, activeCategories],
  );

  return { facilities, filteredFacilities, isLoading, error };
}
