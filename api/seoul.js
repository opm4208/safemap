export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { start, end } = req.query;
  const SERVICE_KEY = process.env.REACT_APP_PUBLIC_DATA_KEY;

  const url = `http://openapi.seoul.go.kr:8088/${SERVICE_KEY}/xml/tbSafeReturnItem/${start}/${end}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(text);
  } catch (error) {
    res.status(500).json({ error: "서울시 API 호출 실패" });
  }
}
