import { useEffect, useRef } from "react";
import { useLocationStore } from "../store";

// ─── 위치 관련 ViewModel ──────────────────────────────────────
// GPS 위치 추적, 수동 위치 설정, GPS 복원 담당
export function useLocationViewModel() {
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

  // 수동 위치 설정
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
