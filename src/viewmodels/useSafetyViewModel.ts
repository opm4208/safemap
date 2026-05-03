import { useEffect } from "react";
import {
  useLocationStore,
  useMarkerStore,
  useFilterStore,
  useSafetyStore,
} from "../store";
import { SafetyModel } from "../models/SafetyModel";

// ─── Safety ViewModel ─────────────────────────────────────────
// SafetyModel을 사용해 안전 점수 계산 후 View에 전달
export function useSafetyViewModel() {
  const { currentLocation } = useLocationStore();
  const { facilities } = useMarkerStore();
  const { searchRadius } = useFilterStore();
  const { safetyScore, setSafetyScore } = useSafetyStore();

  useEffect(() => {
    if (!currentLocation || facilities.length === 0) return;
    // Model에서 계산 로직 담당
    const score = SafetyModel.calculateScore(
      currentLocation,
      facilities,
      searchRadius,
    );
    setSafetyScore(score);
  }, [currentLocation, facilities, searchRadius, setSafetyScore]);

  return safetyScore;
}
