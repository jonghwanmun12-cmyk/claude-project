# 04 — 일자별 일정 뷰 + 캘린더/PDF 내보내기

## Outcome

확정된 루트를 Day 1, Day 2... 형태의 일자별 일정표로 보고, 캘린더 파일(.ics) 또는 PDF로 내보낼 수 있다.

## Blockers

01-basic-route-planner — 내보낼 확정된 루트가 있어야 한다.

## Acceptance criteria

- [x] 확정된 루트가 일자별(Day 1, Day 2...)로 표시된다.
- [x] "내보내기"를 누르면 .ics 파일이 생성된다.
- [x] "내보내기"를 누르면 PDF 파일이 생성된다.
- [x] 내보낸 파일의 날짜·도시 정보가 화면에 표시된 일정과 일치한다.

## Constraints

일자별 일정은 03번 태스크에서 만든 `lib/itinerary.ts`의 도시별 체크인/체크아웃 경계를 그대로 써서 만든다. 그래야 이 화면의 날짜가 "추천 루트" 섹션의 숙소 검색 날짜와 항상 같다.

jsPDF 기본 폰트가 한글 글리프를 지원하지 않아, PDF 내보내기에는 도시의 로마자 표기(`City.nameEn`, 이번 태스크에서 추가)를 쓴다. 화면과 .ics는 한글 표기를 그대로 쓴다 — 같은 날짜·같은 도시를 가리키는 표기만 다르다.

## Verification

- 내보낸 .ics 파일을 파싱해 날짜·이벤트가 화면의 일정과 일치하는지 확인.
- 내보낸 PDF에 포함된 텍스트(날짜, 도시명)가 화면의 일정과 일치하는지 확인.

## Review checkpoint

None.

## Status

completed

## Execution

- Verification: `vitest run`(42/42 통과, buildDayPlan/buildIcsContent/buildDayPlanLines·PDF Blob 테스트 포함), `tsc --noEmit`, `eslint` 모두 통과. 브라우저에서 실제로 "캘린더 내보내기"·"PDF 내보내기"를 눌러 생성된 Blob을 가로채 확인: .ics는 9개 VEVENT가 화면의 Day 1~9와 같은 날짜·도시였고, PDF는 원시 텍스트에 "Rome"·"Day 1"·"Venice"·"2026-09-10"이 그대로 담겨 있었다.
- Blocker: —
- Revision: PDF 내보내기에 필요해 `City`에 로마자 표기(`nameEn`) 필드를 추가(태스크 01에서 만든 travel-data.ts 확장). `code-review low` 1회 — findings 없음.
