export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { coords } = req.query;
  const url = `https://router.project-osrm.org/route/v1/foot/${coords}?overview=full&geometries=geojson`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "OSRM API 호출 실패" });
  }
}
