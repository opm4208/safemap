import React from "react";
import { MapContainer } from "./components/map/MapContainer";

// MapContainer가 최상위 View 역할
function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <MapContainer />
    </div>
  );
}

export default App;
