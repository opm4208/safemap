import { useRef } from "react";
import { useMarkerStore } from "../store";
import type { Coordinate, SafetyFacility } from "../types";

// ─── 지도 관련 ViewModel ──────────────────────────────────────
// 카카오 지도 초기화, 마커 렌더링, 위치 이동 등 지도 관련 로직 담당
export function useMapViewModel() {
  const mapRef = useRef<any>(null);
  const mapInitializedRef = useRef(false);
  const markersRef = useRef<any[]>([]);
  const myLocationMarkerRef = useRef<any>(null);
  const clustererRef = useRef<any>(null);

  const { selectFacility } = useMarkerStore();

  // 지도 초기화 여부 반환
  const isMapReady = () => mapInitializedRef.current;

  // 카카오 지도 초기화
  const initMap = (container: HTMLDivElement) => {
    if (mapInitializedRef.current) return;

    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 4,
    };

    mapRef.current = new window.kakao.maps.Map(container, options);
    mapInitializedRef.current = true;

    // 클러스터러 초기화
    clustererRef.current = new window.kakao.maps.MarkerClusterer({
      map: mapRef.current,
      averageCenter: true,
      minLevel: 5,
      styles: [
        {
          width: "40px",
          height: "40px",
          background: "rgba(59, 130, 246, 0.8)",
          borderRadius: "50%",
          color: "#fff",
          textAlign: "center",
          fontWeight: "700",
          lineHeight: "40px",
          fontSize: "14px",
        },
        {
          width: "50px",
          height: "50px",
          background: "rgba(239, 68, 68, 0.8)",
          borderRadius: "50%",
          color: "#fff",
          textAlign: "center",
          fontWeight: "700",
          lineHeight: "50px",
          fontSize: "16px",
        },
      ],
    });
  };

  // 지도 중심 이동
  const moveToLocation = (coord: Coordinate) => {
    if (!mapRef.current) return;
    mapRef.current.setCenter(
      new window.kakao.maps.LatLng(coord.lat, coord.lng),
    );
  };

  // 내 위치 마커 업데이트
  const updateMyLocationMarker = (coord: Coordinate) => {
    if (!mapRef.current) return;

    const position = new window.kakao.maps.LatLng(coord.lat, coord.lng);

    if (myLocationMarkerRef.current) {
      myLocationMarkerRef.current.setMap(null);
    }

    const myMarkerImage = new window.kakao.maps.MarkerImage(
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
      new window.kakao.maps.Size(24, 35),
    );

    myLocationMarkerRef.current = new window.kakao.maps.Marker({
      position,
      map: mapRef.current,
      image: myMarkerImage,
      title: "내 위치",
    });
  };

  // 시설물 마커 렌더링
  const renderFacilityMarkers = (
    facilities: SafetyFacility[],
    categoryColors: Record<string, string>,
  ) => {
    if (!mapRef.current || !clustererRef.current) return;

    clustererRef.current.clear();
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const markers = facilities.map((facility) => {
      const position = new window.kakao.maps.LatLng(
        facility.coordinate.lat,
        facility.coordinate.lng,
      );

      const color = categoryColors[facility.category];
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
        selectFacility(facility);
      });

      return marker;
    });

    clustererRef.current.addMarkers(markers);
    markersRef.current = markers;
  };

  // 지도 클릭 이벤트 등록
  const addClickListener = (callback: (coord: Coordinate) => void) => {
    if (!mapRef.current) return;
    window.kakao.maps.event.addListener(
      mapRef.current,
      "click",
      (mouseEvent: any) => {
        const latlng = mouseEvent.latLng;
        callback({ lat: latlng.getLat(), lng: latlng.getLng() });
      },
    );
  };

  return {
    mapRef,
    clustererRef,
    isMapReady,
    initMap,
    moveToLocation,
    updateMyLocationMarker,
    renderFacilityMarkers,
    addClickListener,
  };
}
