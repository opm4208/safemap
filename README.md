# 🛡️ SafeMap — 내 주변 안전 지도

> 서울시 안전 시설물 데이터를 기반으로 현재 위치 주변의 CCTV, 비상벨을 지도에 시각화하고 안전한 귀갓길을 추천하는 웹 서비스

🔗 **배포 URL**: https://safemap-eta.vercel.app

---

## 📌 프로젝트 소개

야간 보행 안전에 대한 관심이 높아지는 가운데, 서울시 안심귀갓길 공공데이터를 활용해 주변 안전 시설물을 한눈에 확인할 수 있는 지도 서비스를 개발했습니다.

단순한 시설물 표시를 넘어 현재 위치의 **안전 점수**를 실시간으로 계산하고, 출발지에서 목적지까지 **안전 시설이 밀집된 경로**를 추천합니다.

---

## ✨ 주요 기능

| 기능                | 설명                                                  |
| ------------------- | ----------------------------------------------------- |
| 🗺️ 실시간 위치 표시 | GPS 기반 현재 위치를 지도에 표시, 수동 위치 변경 가능 |
| 📍 안전 시설물 마커 | CCTV, 비상벨 위치를 카테고리별 색상으로 구분 표시     |
| 🔍 필터링           | 카테고리별 토글, 검색 반경(300m~2km) 설정             |
| 📊 안전 점수        | 현재 위치 반경 내 시설 밀집도 기반 A~F 등급 산출      |
| 🏠 안전 귀갓길 추천 | 출발지~목적지 도보 경로 분석 후 안전 점수 시각화      |
| 🔵 마커 클러스터링  | 줌 레벨에 따른 마커 그룹화로 성능 최적화              |

---

## 🛠️ 기술 스택

### Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178C6?logo=typescript)
![Zustand](https://img.shields.io/badge/Zustand-5.0-FF6B6B)

### Map & API

![Kakao Maps](https://img.shields.io/badge/Kakao_Maps_SDK-yellow?logo=kakao)
![Seoul Open API](https://img.shields.io/badge/서울시_공공데이터_API-blue)
![OSRM](https://img.shields.io/badge/OSRM-도보경로-green)

### DevOps

![Vercel](https://img.shields.io/badge/Vercel-배포-black?logo=vercel)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD-2088FF?logo=githubactions)

---

## 🏗️ 아키텍처 — MVVM 패턴

```
src/
├── models/          # Model - 비즈니스 로직
│   ├── SafetyModel.ts       # 안전 점수 계산
│   ├── MarkerModel.ts       # 시설물 필터링/집계
│   ├── RouteModel.ts        # 경로 계산/분석
│   ├── FilterModel.ts       # 필터 상태 로직
│   └── LocationModel.ts     # 위치 유효성 검사
├── viewmodels/      # ViewModel - UI 상태 관리
│   ├── useLocationViewModel.ts
│   ├── useMarkerViewModel.ts
│   ├── useSafetyViewModel.ts
│   ├── useRouteViewModel.ts
│   ├── useFilterViewModel.ts
│   └── useMapViewModel.ts
├── components/      # View - 렌더링만 담당
│   ├── map/         # 지도 컨테이너, 마커
│   ├── filter/      # 필터 패널
│   ├── safety/      # 안전 점수 카드
│   ├── route/       # 귀갓길 패널
│   └── facility/    # 시설물 상세
├── services/        # 외부 API 통신
├── store/           # Zustand 전역 상태
└── types/           # 공통 타입 정의
```

---

## 🔄 데이터 흐름

```
서울시 공공데이터 API (11,883개 시설물)
          ↓
    PublicDataService
          ↓
  useMarkerViewModel ──→ MarkerModel (필터링)
          ↓
    FacilityMarkers (카카오 지도에 렌더링)


GPS / 클릭 이벤트
          ↓
  useLocationViewModel
          ↓
  useSafetyViewModel ──→ SafetyModel (점수 계산)
          ↓
    SafetyScoreCard (A~F 등급 표시)


출발지 / 목적지 클릭
          ↓
  useRouteViewModel
          ↓
  RouteService ──→ RouteModel ──→ OSRM API
          ↓
    RoutePanel (경로 색상 + 점수 표시)
```

---

## 📊 안전 점수 알고리즘

현재 위치 반경 내 안전 시설 밀집도를 기반으로 점수를 계산합니다.

```
score = (CCTV수 / 10) × 60점 + (비상벨수 / 5) × 40점
```

| 점수 | 등급 | 의미      |
| ---- | ---- | --------- |
| 80+  | A    | 매우 안전 |
| 60+  | B    | 안전      |
| 40+  | C    | 보통      |
| 20+  | D    | 주의      |
| ~20  | F    | 위험      |

---

## 🚧 CORS 해결 방법

브라우저에서 외부 API 직접 호출 시 CORS 정책으로 차단되는 문제를 **Vercel Serverless Functions**로 해결했습니다.

```
브라우저 → Vercel API Route → 외부 API
              (서버끼리 통신, CORS 없음)
```

- `api/seoul.js` → 서울시 공공데이터 프록시
- `api/osrm.js` → OSRM 도보 경로 프록시

---

## ⚙️ CI/CD 파이프라인

GitHub Actions를 통해 자동화된 CI/CD 파이프라인을 구성했습니다.

```
PR / Push
    ↓
GitHub Actions 자동 실행
    ├── 의존성 설치 (npm ci)
    ├── 테스트 실행 (npm test)
    └── 빌드 확인 (npm run build)
         ↓
      성공 시
         ↓
   Vercel 자동 배포
```

---

## 🧪 테스트

Model 레이어 단위 테스트를 작성했습니다.

```bash
npm test
```

| 테스트 파일           | 테스트 항목                        |
| --------------------- | ---------------------------------- |
| `SafetyModel.test.ts` | 등급 계산, 점수 계산, 반환값 검증  |
| `MarkerModel.test.ts` | 카테고리 필터링, 반경 필터링, 집계 |
| `FilterModel.test.ts` | 전체 선택, 반경 유효성, 토글       |

---

## 🚀 로컬 실행 방법

```bash
# 저장소 클론
git clone https://github.com/본인아이디/safemap.git
cd safemap

# 의존성 설치
npm install

# 환경변수 설정
# .env 파일 생성 후 아래 내용 입력
REACT_APP_KAKAO_KEY=카카오_JavaScript_키
REACT_APP_PUBLIC_DATA_KEY=서울시_공공데이터_키

# 개발 서버 실행
npm start
```

---

## 📝 개발하면서 겪은 문제와 해결

**1. 카카오 지도 SDK 중복 로드 문제**

- 문제: React StrictMode로 인해 useEffect가 두 번 실행되어 스크립트가 중복 로드됨
- 해결: `mapInitializedRef`로 초기화 여부를 추적해 최초 1회만 실행되도록 처리

**2. 11,883개 마커 렌더링 성능 문제**

- 문제: 전체 마커를 DOM에 올리면 줌 시 심각한 렉 발생
- 해결: 카카오 지도 MarkerClusterer로 줌 레벨 5 이상에서 클러스터링 적용

**3. 지도 클릭 이벤트에서 최신 상태값 참조 문제**

- 문제: 카카오 지도 클릭 이벤트 핸들러가 초기 상태값을 클로저로 캡처해 최신값 참조 불가
- 해결: `useRef`로 상태를 동기화해 이벤트 핸들러에서 최신값 참조

**4. 배포 환경 CORS 문제**

- 문제: 개발환경의 setupProxy.js가 배포환경에서 작동하지 않음
- 해결: Vercel Serverless Functions로 프록시 서버 구현
