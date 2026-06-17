# Benefits Tool — 개발 가이드

> 기획전 혜택 데이터 입력 · 검증 · 클렌징 툴  
> 순수 HTML/CSS/JS 단일 파일 — 서버 불필요, 이미지 서버 정적 배포용

---

## 파일 구조

```
benefits-tool.html   ← 전부 이 파일 하나
```

내부 구조:

```
<head>
  <style>          CSS 전체 (CSS 변수 기반)
</head>
<body>
  .header          상단 헤더
  .tabs            탭 네비게이션 (탭1 | 탭2)

  #tab-form        탭1: 기획자 입력 폼
  #tab-validator   탭2: 검증 & 클렌징

  <script>         JS 전체
</body>
```

---

## CSS 변수 (테마)

```css
:root {
  --bg: #0f0f13;           /* 페이지 배경 */
  --surface: #18181f;      /* 카드/헤더 배경 */
  --surface2: #22222c;     /* 입력 필드 배경 */
  --border: #2e2e3a;       /* 테두리 */
  --accent: #1428A0;       /* 삼성 블루 (버튼 primary) */
  --accent2: #4F7BFF;      /* 강조 텍스트, 포커스 */
  --text: #e8e8f0;         /* 본문 텍스트 */
  --text-muted: #7a7a96;   /* 보조 텍스트 */
  --success: #22c55e;
  --error: #ef4444;
  --warning: #f59e0b;
  --radius: 10px;
}
```

라이트 모드로 바꾸고 싶으면 이 변수만 수정하면 됩니다.

---

## 탭 1 — 기획자 입력 폼

### 고정 영역 필드

| HTML id | JSON 키 | 설명 |
|---|---|---|
| `event_name` | `event_name` | 기획전 명 (BO 등록명) |
| `event_url` | `event_url` | 라이브 URL |
| `event_description` | `event_description` | 기획전 상세설명 |
| `event_caution` | `event_caution` | 유의사항 (마침표+띄어쓰기 구분) |

### 혜택 항목 필드 (반복)

| name 속성 | JSON 키 | 타입 | 비고 |
|---|---|---|---|
| `benefit_name` | `benefit_name` | text | 필수 |
| `benefit_start_datetime` | `benefit_start_datetime` | datetime-local | 없으면 null |
| `benefit_end_datetime` | `benefit_end_datetime` | datetime-local | 없으면 null |
| `benefit_description` | `benefit_description` | textarea | 필수 |
| `benefit_cautions` | `benefit_cautions` | textarea | 쉼표 구분 |
| `benefit_early_termination_yn` | `benefit_early_termination_yn` | select Y/N | 선착순 종료 여부 |
| `all_yn` | `all_yn` | select Y/N | 공통혜택 여부 |
| `benefit_image_url` | `benefit_image_url` | text | 없으면 빈칸 |

### 주요 함수

```js
addBenefit(data = {})      // 혜택 카드 DOM 추가. data 넘기면 값 채워짐
removeBenefit(id)          // 혜택 카드 삭제
collectData()              // 폼 전체 수집 → 객체 반환
generateJSON()             // JSON 생성 후 미리보기 노출
copyJSON()                 // 생성된 JSON 클립보드 복사
exportExcel()              // SheetJS로 .xlsx 다운로드
loadSample()               // 샘플 데이터 자동 입력
clearAll()                 // 전체 초기화
```

### 엑셀 내보내기

- 라이브러리: [SheetJS (xlsx 0.18.5)](https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js)
- 첫 클릭 시 CDN에서 동적 로드 → 이후 캐시됨
- 인터넷 없는 환경이라면 아래처럼 로컬 번들로 교체:

```html
<!-- <head> 안에 추가 -->
<script src="./xlsx.full.min.js"></script>
```

---

## 탭 2 — 검증 & 클렌징

### 클렌징 파이프라인 (순서대로 실행)

```
1. CRLF → LF 정규화
2. <script> 태그 감지 → 내부만 추출
3. JSON 블록 추출 ({ ... } 범위)
4. 값 앞뒤 공백 제거  "   값   " → "값"
5. 엑셀 탭 문자 제거 (한글 레이블 컬럼 잡음)
6. trailing comma 제거 (,} ,] 패턴)
7. JSON.parse() 파싱 시도
8. 파싱 성공 시 → 필드 유효성 검사
9. JSON.stringify(parsed, null, 2) 재직렬화
```

### 유효성 검사 항목

| 항목 | 레벨 | 조건 |
|---|---|---|
| `event_name` 필수 | ❌ error | 값 없음 |
| `event_url` 필수 | ❌ error | 값 없음 |
| `benefits` 배열 필수 | ❌ error | 값 없음 |
| `event_url` 형식 | ⚠️ warn | http 시작 아님 |
| 쌍따옴표 포함 | ⚠️ warn | `\"` 이스케이프 감지 |
| `benefit_name` 필수 | ❌ error | 혜택별 |
| `benefit_description` 필수 | ❌ error | 혜택별 |
| `benefit_early_termination_yn` Y/N | ⚠️ warn | Y 또는 N 아닌 값 |
| `all_yn` Y/N | ⚠️ warn | Y 또는 N 아닌 값 |
| 날짜 형식 | ⚠️ warn | `YYYY-MM-DD HH:MM:SS` 불일치 |
| 이미지 URL 형식 | ⚠️ warn | `//` 또는 `http` 시작 아님 |

### 주요 함수

```js
runValidation()            // 클렌징 + 검증 실행 (메인 진입점)
cleanAndValidate(raw)      // 클렌징 파이프라인 → { cleaned, issues } 반환
renderValidationResult()   // 검증 결과 DOM 렌더링
renderCleanJSON()          // 정제된 JSON DOM 렌더링
copyCleanJSON()            // 정제된 JSON 복사
copyScriptTag()            // <script> 태그 포함 복사
clearValidator()           // 초기화
```

---

## 출력 JSON 구조

```json
{
  "event_name": "전시컨텐츠[BESPOKE 청소기 | vacuum-cleaner]",
  "event_url": "https://www.samsung.com/sec/event/vacuum-cleaner/",
  "event_description": "Bespoke AI 스팀 신제품과 12개월 구독료 포인트 혜택",
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
{
  ...
}
</script>
```

---

## 수정 포인트 빠른 찾기

| 수정 목적 | 찾을 키워드 |
|---|---|
| 색상/테마 변경 | `:root {` |
| 헤더 텍스트 변경 | `Benefits Tool` |
| 고정 영역 필드 추가 | `<!-- 고정 영역 -->` 또는 `event_caution` |
| 혜택 필드 추가 | `benefit_image_url` 아래에 추가, `collectData()` 함수도 동일하게 추가 |
| 유효성 규칙 추가 | `cleanAndValidate(raw)` 함수 내 `Step 7` 이후 |
| 엑셀 컬럼 구조 변경 | `doExport(rows, name)` 함수 |
| 샘플 데이터 변경 | `loadSample()` 함수 |
| 토스트 노출 시간 변경 | `2800` (ms) |

---

## 배포

```
이미지 서버 업로드:
  benefits-tool.html   ← 이 파일만 올리면 끝

외부 의존성:
  - SheetJS CDN (엑셀 내보내기 시 자동 로드)
    https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js

오프라인 배포 시:
  xlsx.full.min.js 를 같은 경로에 두고
  exportExcel() 함수의 CDN 로드 부분 제거
```

---

## 브라우저 지원

| 기능 | 필요 API |
|---|---|
| 클립보드 복사 | `navigator.clipboard` (Chrome 66+, HTTPS 필요) |
| 엑셀 다운로드 | `Blob`, `URL.createObjectURL` |
| 날짜 입력 | `input[type=datetime-local]` (IE 미지원) |

> `navigator.clipboard`는 **HTTPS** 또는 **localhost** 환경에서만 동작합니다.  
> HTTP 이미지 서버라면 복사 버튼이 작동하지 않을 수 있으니 HTTPS 확인 필요.
