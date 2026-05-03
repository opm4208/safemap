import React, { useEffect, useRef, useState } from "react";
import { useMapViewModel } from "../../viewmodels/useMapViewModel";
import { useRouteViewModel } from "../../viewmodels/useRouteViewModel";
import { useLocationViewModel } from "../../viewmodels/useLocationViewModel";
import { useMarkerViewModel } from "../../viewmodels/useMarkerViewModel";
import { useSafetyViewModel } from "../../viewmodels/useSafetyViewModel";
import { useMarkerStore } from "../../store";
import { MyLocationMarker } from "./MyLocationMarker";
import { FacilityMarkers } from "./FacilityMarkers";
import { FilterPanel } from "../filter/FilterPanel";
import { SafetyScoreCard } from "../SafetyScoreCard";
import { FacilityDetailPanel } from "../facility/FacilityDetailPanel";
import { RoutePanel } from "../route/RoutePanel";
import type { Coordinate } from "../../types";

declare global {
  interface Window {
    kakao: any;
  }
}

type SelectMode = "none" | "start" | "end";

// ─── MapContainer View ────────────────────────────────────────
// 지도 컨테이너 최상위 View - 모든 ViewModel을 연결하고 하위 View들을 조합
export function MapContainer() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const myLocationMarkerRef = useRef<any>(null);

  // 위치 수정 모드
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const isEditingLocationRef = useRef(false);
  const handleSetEditingLocation = (val: boolean) => {
    isEditingLocationRef.current = val;
    setIsEditingLocation(val);
  };

  // 경로 선택 모드
  const [selectMode, setSelectMode] = useState<SelectMode>("none");
  const selectModeRef = useRef<SelectMode>("none");
  const handleSetSelectMode = (mode: SelectMode) => {
    selectModeRef.current = mode;
    setSelectMode(mode);
  };

  // ─── ViewModels 연결 ─────────────────────────────────────────
  const { mapRef, clustererRef, initMap, moveToLocation, addClickListener } =
    useMapViewModel();

  const { currentLocation, setManualLocation, resetToGPS } =
    useLocationViewModel();
  const { filteredFacilities, isLoading, error } = useMarkerViewModel();
  const safetyScore = useSafetyViewModel();
  const { selectedFacility, selectFacility } = useMarkerStore();

  const {
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
    clearRoutes: clearRoutesBase,
  } = useRouteViewModel(mapRef);

  const clearRoutes = () => {
    clearRoutesBase();
    handleSetSelectMode("none");
  };

  // ─── 카카오 지도 초기화 ──────────────────────────────────────
  useEffect(() => {
    const waitForKakao = () => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.LatLng) {
        if (!mapContainerRef.current) return;
        initMap(mapContainerRef.current);

        addClickListener((coord: Coordinate) => {
          if (selectModeRef.current === "start") {
            setStartPoint(coord);
            addRouteMarker(coord, "start");
            handleSetSelectMode("end");
          } else if (selectModeRef.current === "end") {
            setEndPoint(coord);
            addRouteMarker(coord, "end");
            handleSetSelectMode("none");
          } else if (isEditingLocationRef.current) {
            setManualLocation(coord);
            handleSetEditingLocation(false);
          }
        });
      } else {
        setTimeout(waitForKakao, 100);
      }
    };
    waitForKakao();
  }, []);

  // ─── 경로 선택 모드 안내 메시지 ─────────────────────────────
  const getModeMessage = () => {
    if (selectMode === "start") return "🟢 출발지를 지도에서 클릭하세요";
    if (selectMode === "end") return "🔴 목적지를 지도에서 클릭하세요";
    return null;
  };

  return (
    <div style={styles.container}>
      {/* 지도 렌더링 영역 */}
      <div ref={mapContainerRef} style={styles.map} />

      {/* 내 위치 마커 View */}
      <MyLocationMarker
        mapRef={mapRef}
        markerRef={myLocationMarkerRef}
        location={currentLocation}
      />

      {/* 시설물 마커 View */}
      <FacilityMarkers
        mapRef={mapRef}
        clustererRef={clustererRef}
        facilities={filteredFacilities}
        onFacilityClick={selectFacility}
      />

      {/* 로딩 표시 */}
      {isLoading && (
        <div style={styles.loadingBadge}>⏳ 시설 정보 불러오는 중...</div>
      )}

      {/* 경로 선택 모드 안내 */}
      {getModeMessage() && (
        <div style={styles.modeBadge}>{getModeMessage()}</div>
      )}

      {/* 위치 수정 모드 안내 */}
      {isEditingLocation && (
        <div style={{ ...styles.modeBadge, backgroundColor: "#059669" }}>
          📍 위치를 변경할 곳을 클릭하세요
        </div>
      )}

      {/* API 오류 표시 */}
      {error && <div style={styles.errorBadge}>⚠️ {error}</div>}

      {/* Filter View */}
      <FilterPanel />

      {/* Safety View */}
      {safetyScore && <SafetyScoreCard score={safetyScore} />}

      {/* Route View */}
      <RoutePanel
        onSelectStart={() => handleSetSelectMode("start")}
        onSelectEnd={() => handleSetSelectMode("end")}
        onFindRoute={findRoute}
        onClear={clearRoutes}
        startSet={!!startPoint}
        endSet={!!endPoint}
        isCalculating={isCalculating}
        safetyScore={routeScore}
        routeDistance={routeDistance}
        routeDuration={routeDuration}
        cctvCount={routeCctv}
        bellCount={routeBell}
      />

      {/* Facility Detail View */}
      {selectedFacility && (
        <FacilityDetailPanel
          facility={selectedFacility}
          onClose={() => selectFacility(null)}
        />
      )}

      {/* 버튼 그룹 */}
      <div style={styles.btnGroup}>
        <button
          style={styles.myLocationBtn}
          onClick={() => {
            resetToGPS();
            if (currentLocation) moveToLocation(currentLocation);
          }}
        >
          📍 내 위치
        </button>
        <button
          style={{
            ...styles.myLocationBtn,
            backgroundColor: isEditingLocation ? "#EF4444" : "#fff",
            color: isEditingLocation ? "#fff" : "#111827",
          }}
          onClick={() => handleSetEditingLocation(!isEditingLocation)}
        >
          {isEditingLocation ? "✕ 취소" : "✏️ 위치 수정"}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { position: "relative", width: "100vw", height: "100vh" },
  map: { width: "100vw", height: "100vh" },
  loadingBadge: {
    position: "absolute",
    top: 16,
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: "8px 16px",
    borderRadius: 20,
    fontSize: 13,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    zIndex: 10,
  },
  modeBadge: {
    position: "absolute",
    top: 56,
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#1E40AF",
    color: "#fff",
    padding: "8px 20px",
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    zIndex: 10,
  },
  errorBadge: {
    position: "absolute",
    top: 16,
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#FEF2F2",
    color: "#EF4444",
    padding: "8px 16px",
    borderRadius: 20,
    fontSize: 13,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    zIndex: 10,
  },
  btnGroup: {
    position: "absolute",
    bottom: 32,
    right: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    zIndex: 10,
  },
  myLocationBtn: {
    backgroundColor: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "10px 16px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
};
