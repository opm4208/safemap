import type { SafetyFacility, Coordinate } from "../types";

// // ─── 환경 변수에서 API 키 가져오기 ───────────────────────────
// const SERVICE_KEY = "476466736a7061723432507868496c";

// ─── FACI_CODE별 카테고리 매핑 ───────────────────────────────
// 301, 302: CCTV / 307: 비상벨
function getFacilityCategory(faciCode: string) {
  switch (faciCode) {
    case "301":
    case "302":
      return "cctv" as const;
    case "307":
      return "emergency_bell" as const;
    default:
      return null;
  }
}

// ─── POINT WKT 문자열에서 좌표 추출 ─────────────────────────
// 예: "POINT (126.968 37.579)" → { lng: 126.968, lat: 37.579 }
function parseWkt(wkt: string): Coordinate | null {
  const match = wkt.match(/POINT\s*\(([0-9.]+)\s+([0-9.]+)\)/);
  if (!match) return null;
  return {
    lng: parseFloat(match[1]),
    lat: parseFloat(match[2]),
  };
}

// ─── XML 태그 값 추출 헬퍼 ───────────────────────────────────
function getTagValue(element: Element, tagName: string): string {
  return element.querySelector(tagName)?.textContent ?? "";
}

// ─── 서울시 안심귀갓길 안전시설물 API ────────────────────────
// 배포 환경에서는 Vercel API Route 사용
const isProduction = process.env.NODE_ENV === "production";

export const PublicDataService = {
  async fetchAllFacilities(
    center: Coordinate,
    radiusMeters: number,
  ): Promise<SafetyFacility[]> {
    const totalCount = 11883;
    const pageSize = 1000;
    const totalPages = Math.ceil(totalCount / pageSize);

    const requests = Array.from({ length: totalPages }, (_, i) => {
      const start = i * pageSize + 1;
      const end = Math.min((i + 1) * pageSize, totalCount);

      // 개발: 직접 호출, 배포: Vercel API Route 사용
      const url = isProduction
        ? `/api/seoul?start=${start}&end=${end}`
        : `http://openapi.seoul.go.kr:8088/476466736a7061723432507868496c/xml/tbSafeReturnItem/${start}/${end}`;

      return fetch(url).then((res) => res.text());
    });

    const results = await Promise.all(requests);
    const parser = new DOMParser();
    const facilities: SafetyFacility[] = [];

    results.forEach((text) => {
      const xml = parser.parseFromString(text, "text/xml");
      const rows = xml.querySelectorAll("row");

      rows.forEach((row) => {
        const faciCode = getTagValue(row, "FACI_CODE");
        const category = getFacilityCategory(faciCode);
        if (!category) return;

        const wkt = getTagValue(row, "POINT_WKT");
        const coordinate = parseWkt(wkt);
        if (!coordinate) return;

        facilities.push({
          id: getTagValue(row, "FACI_ID"),
          category,
          name: getTagValue(row, "ASG_NM") || "안전시설물",
          address: `${getTagValue(row, "SGG_NAME")} ${getTagValue(row, "EMD_NM")}`,
          managedBy: getTagValue(row, "INST_NM") || "서울특별시",
          coordinate,
        });
      });
    });

    console.log("전체 시설 수:", facilities.length);
    return facilities;
  },
};
