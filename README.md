# BS-Rubicon — 기획전 혜택 데이터 관리 툴

v1 :
https://images.samsung.com/kdp/event/sec/2026/rubicon/v1.1/rubicon-tool.html

삼성닷컴 기획전 페이지의 혜택 데이터를 입력·검증·변환하는 인터널 툴입니다.  
서버 없이 HTML 파일만으로 동작합니다.

---

## 기능

- **데이터 입력 폼** — 기획전 기본 정보 및 혜택 항목을 GUI로 입력
- **JSON 생성** — `<script type="application/json">` 형식으로 즉시 출력 및 복사
- **엑셀 내보내기 / 불러오기** — SheetJS 기반 `.xlsx` 양방향 변환
- **엑셀 붙여넣기** — 엑셀 셀을 그대로 복사해서 붙여넣으면 자동 파싱
- **데이터 검증** — JSON 구문 오류, 필수 필드 누락, 날짜 형식, URL 형식 등 자동 체크
- **다크 / 라이트 테마** 토글
- **달력 날짜 선택** — 커스텀 날짜 피커 내장

---

## 파일 구조

```
rubicon-tool.html   ← 진입점 (HTML 마크업)
benefits-tool.js    ← 전체 로직
benefits-tool.css   ← 스타일 (CSS 변수 기반 테마)
```

외부 의존성은 SheetJS CDN 하나뿐이며 엑셀 기능 첫 사용 시 자동 로드됩니다.

---

## 사용 방법

### 로컬 실행

별도 설치 없이 `rubicon-tool.html` 파일을 브라우저에서 열면 됩니다.

> 클립보드 복사(`navigator.clipboard`)는 **HTTPS** 또는 **localhost** 환경에서만 동작합니다.

### 배포

정적 파일 서버(이미지 서버 등)에 세 파일을 그대로 올리면 됩니다.

```
rubicon-tool.html
benefits-tool.js
benefits-tool.css
```

오프라인 환경이라면 `xlsx.full.min.js`를 같은 경로에 두고 `loadXLSX()` 함수의 CDN URL을 로컬 경로로 교체하세요.

---

## 엑셀 붙여넣기 지원 포맷

기획전 담당자가 사용하는 엑셀 템플릿은 구조가 다양합니다.  
아래 형식을 모두 자동 인식하여 파싱합니다.

### 포맷 A — JSON 한 줄이 한 셀 (툴 내보내기 형식)

| A열 | B열 |
|---|---|
| `"event_name" : "삼성 이벤트",` | `기획전 명` |

### 포맷 B — 키·값·닫는따옴표가 별도 셀 (3컬럼)

| A열 | B열 | C열 |
|---|---|---|
| `"event_name" : "` | `삼성 이벤트` | `",` |

### 포맷 C — 레이블·키·값·닫는따옴표·주석 (A~F열)

| A열 | B열 | C열 | D열 | E열 | F열 |
|---|---|---|---|---|---|
| `기획전 명` | `"event_name" : "` | `삼성 이벤트` | `",` | (영역 구분) | `BO 등록 기획전 명` |

포맷 C는 F열 주석에 멀티라인 셀이 있어도 올바르게 처리합니다.

### 공통 처리 사항

- `<script type="application/json">` 태그 자동 감지 및 내용 추출
- 엑셀에서 발생하는 유니코드 공백 자동 정규화  
  (`U+00A0`, `U+FEFF`, `U+200B`, `U+2000~U+200A` 등)
- trailing comma 자동 제거
- 파싱 후 모든 문자열 값 앞뒤 공백 trim

---

## 출력 JSON 구조

```json
{
  "event_name": "전시컨텐츠[BESPOKE 청소기 | vacuum-cleaner]",
  "event_url": "https://www.samsung.com/sec/event/vacuum-cleaner/",
  "event_description": "Bespoke AI 스팀 신제품과 12개월 구독료 포인트 혜택 놓치지 마세요",
  "event_caution": "모든 혜택은 본 프로모션 페이지에 노출된 행사모델에 한하여 적용됩니다.",
  "benefits": [
    {
      "benefit_name": "알림 신청 시 신제품 추가 할인 쿠폰 1만원 증정",
      "benefit_start_datetime": "2026-06-11 10:00:00",
      "benefit_end_datetime": "2026-06-30 23:59:59",
      "benefit_description": "알림 신청 시 신제품 추가 할인 쿠폰 1만원 증정",
      "benefit_cautions": "기준가 대비 쿠폰 적용가, 대상 모델 : 2026 Bespoke AI 스팀",
      "benefit_early_termination_yn": "N",
      "all_yn": "N",
      "benefit_image_url": "//images.samsung.com/.../icon.png"
    }
  ]
}
```

HTML 삽입 형태:

```html
<script type="application/json" id="benefits-data">
{ ... }
</script>
```

---

## 유효성 검사 항목

| 항목 | 레벨 |
|---|---|
| `event_name`, `event_url`, `benefits` 필수 | ❌ error |
| `benefit_name`, `benefit_description` 필수 | ❌ error |
| `event_url` http 시작 여부 | ⚠️ warn |
| `benefit_early_termination_yn`, `all_yn` Y/N 값 | ⚠️ warn |
| 날짜 형식 `YYYY-MM-DD HH:MM:SS` | ⚠️ warn |
| 이미지 URL `//` 또는 `https://` 시작 여부 | ⚠️ warn |
| 값 내 쌍따옴표 포함 여부 | ⚠️ warn |

---

## 브라우저 지원

| 기능 | 필요 환경 |
|---|---|
| 클립보드 복사 | Chrome 66+ / HTTPS |
| 엑셀 다운로드 | Blob, `URL.createObjectURL` 지원 브라우저 |
| 날짜 입력 | `input[type=datetime-local]` 지원 브라우저 (IE 제외) |
