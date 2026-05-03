import { useEffect } from "react";
import type { Coordinate } from "../../types";

interface Props {
  mapRef: React.MutableRefObject<any>;
  markerRef: React.MutableRefObject<any>;
  location: Coordinate | null;
}

// ─── MyLocationMarker View ────────────────────────────────────
// 내 위치 마커 렌더링 담당
export function MyLocationMarker({ mapRef, markerRef, location }: Props) {
  useEffect(() => {
    if (!location || !mapRef.current) return;

    const position = new window.kakao.maps.LatLng(location.lat, location.lng);

    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    const myMarkerImage = new window.kakao.maps.MarkerImage(
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
      new window.kakao.maps.Size(24, 35),
    );

    markerRef.current = new window.kakao.maps.Marker({
      position,
      map: mapRef.current,
      image: myMarkerImage,
      title: "내 위치",
    });
  }, [location]);

  // 마커는 카카오 지도가 직접 렌더링하므로 null 반환
  return null;
}
