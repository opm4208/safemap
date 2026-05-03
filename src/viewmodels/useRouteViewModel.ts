import { useState, useRef } from "react";
import { findSafeRoutes } from "../services/RouteService";
import { useMarkerStore } from "../store";
import type { Coordinate } from "../types";

export type SelectMode = "none" | "start" | "end";

export function useRouteViewModel(mapRef: React.MutableRefObject<any>) {
  const { facilities } = useMarkerStore();

  const [startPoint, setStartPoint] = useState<Coordinate | null>(null);
  const [endPoint, setEndPoint] = useState<Coordinate | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [routeScore, setRouteScore] = useState<number | null>(null);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [routeDuration, setRouteDuration] = useState<number | null>(null);
  const [routeCctv, setRouteCctv] = useState<number | null>(null);
  const [routeBell, setRouteBell] = useState<number | null>(null);

  const polylinesRef = useRef<any[]>([]);
  const routeMarkersRef = useRef<any[]>([]);

  // 경로 선 그리기
  const drawRoute = (points: Coordinate[], color: string) => {
    if (!mapRef.current) return;
    const path = points.map((p) => new window.kakao.maps.LatLng(p.lat, p.lng));
    const polyline = new window.kakao.maps.Polyline({
      path,
      strokeWeight: 5,
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeStyle: "solid",
    });
    polyline.setMap(mapRef.current);
    polylinesRef.current.push(polyline);
  };

  // 출발지/목적지 마커 추가
  const addRouteMarker = (coord: Coordinate, type: "start" | "end") => {
    if (!mapRef.current) return;
    const position = new window.kakao.maps.LatLng(coord.lat, coord.lng);
    const content = document.createElement("div");
    content.style.cssText = `
      width: 28px; height: 28px;
      background-color: ${type === "start" ? "#10B981" : "#EF4444"};
      border-radius: 50%; border: 3px solid #fff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
      color: white; font-size: 12px; font-weight: bold;
    `;
    content.textContent = type === "start" ? "S" : "E";
    const overlay = new window.kakao.maps.CustomOverlay({
      position,
      content,
      yAnchor: 0.5,
    });
    overlay.setMap(mapRef.current);
    routeMarkersRef.current.push(overlay);
  };

  // 경로 초기화
  const clearRoutes = () => {
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];
    routeMarkersRef.current.forEach((m) => m.setMap(null));
    routeMarkersRef.current = [];
    setStartPoint(null);
    setEndPoint(null);
    setRouteScore(null);
    setRouteDistance(null);
    setRouteDuration(null);
    setRouteCctv(null);
    setRouteBell(null);
  };

  // 안전 경로 계산
  const findRoute = async () => {
    if (!startPoint || !endPoint) return;
    setIsCalculating(true);
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];
    try {
      const routes = await findSafeRoutes(startPoint, endPoint, facilities);
      const best = routes[0];
      if (routes[1]) drawRoute(routes[1].points, "#D1D5DB");
      const routeColor =
        best.score >= 60 ? "#10B981" : best.score >= 40 ? "#F59E0B" : "#EF4444";
      drawRoute(best.points, routeColor);
      setRouteScore(best.score);
      setRouteDistance(best.distanceMeters);
      setRouteDuration(best.durationMinutes);
      setRouteCctv(best.cctvCount);
      setRouteBell(best.bellCount);
    } catch (e) {
      console.error("경로 계산 오류:", e);
    } finally {
      setIsCalculating(false);
    }
  };

  return {
    startPoint,
    setStartPoint,
    endPoint,
    setEndPoint,
    isCalculating,
    routeScore,
    routeDistance,
    routeDuration,
    routeCctv,
    routeBell,
    findRoute,
    addRouteMarker,
    clearRoutes,
  };
}
