// Vercel이 자동으로 실행하는 함수
// req: 브라우저 요청, res: 브라우저에 보낼 응답
export default async function handler(req, res) {
  // CORS 헤더 설정
  // 브라우저에게 "어떤 도메인에서도 이 API 호출 가능"이라고 알려줌
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  // 브라우저가 보낸 좌표값 추출
  // 예: /api/osrm?coords=126.97,37.56;126.99,37.57
  const { coords } = req.query;

  // OSRM API URL 조합
  const url = `https://router.project-osrm.org/route/v1/foot/${coords}?overview=full&geometries=geojson`;

  try {
    // Vercel 서버에서 OSRM API 호출 (서버끼리 통신이라 CORS 없음)
    const response = await fetch(url);
    const data = await response.json();

    // OSRM 응답을 브라우저에 그대로 전달
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "OSRM API 호출 실패" });
  }
}
