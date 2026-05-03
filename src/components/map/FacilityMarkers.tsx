import { useEffect, useRef } from "react";
import type { SafetyFacility } from "../../types";
import { CATEGORY_COLOR } from "../../types";

interface Props {
  mapRef: React.MutableRefObject<any>;
  clustererRef: React.MutableRefObject<any>;
  facilities: SafetyFacility[];
  onFacilityClick: (facility: SafetyFacility) => void;
}

// ─── FacilityMarkers View ─────────────────────────────────────
// 안전 시설물 마커 렌더링 담당
export function FacilityMarkers({
  mapRef,
  clustererRef,
  facilities,
  onFacilityClick,
}: Props) {
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current || !clustererRef.current) return;

    // 기존 마커 제거
    clustererRef.current.clear();
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // 마커 생성
    const markers = facilities.map((facility) => {
      const position = new window.kakao.maps.LatLng(
        facility.coordinate.lat,
        facility.coordinate.lng,
      );

      const color = CATEGORY_COLOR[facility.category];
      const markerImage = new window.kakao.maps.MarkerImage(
        `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
            <circle cx="8" cy="8" r="7" fill="${color}" stroke="white" stroke-width="2"/>
          </svg>
        `)}`,
        new window.kakao.maps.Size(16, 16),
        { offset: new window.kakao.maps.Point(8, 8) },
      );

      const marker = new window.kakao.maps.Marker({
        position,
        image: markerImage,
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        onFacilityClick(facility);
      });

      return marker;
    });

    clustererRef.current.addMarkers(markers);
    markersRef.current = markers;
  }, [facilities]);

  return null;
}
