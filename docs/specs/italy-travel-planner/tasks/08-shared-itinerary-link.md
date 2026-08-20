# 08 — 일정 공유 링크

## Outcome

"공유 링크 만들기"를 누르면 URL이 생성되고, 그 URL을 다른 브라우저에서 로그인 없이 열면 같은 루트와 일자별 일정을 볼 수 있다.

## Blockers

04-day-by-day-view-export — 공유 상대가 보게 될 화면이 일자별 일정 뷰이므로, 그 화면이 먼저 있어야 한다.

## Acceptance criteria

- [x] "공유 링크 만들기"를 누르면 URL이 생성된다.
- [x] 생성된 URL을 다른 브라우저(로그인 없이)에서 열면 원본과 같은 루트/일자별 일정이 표시된다.
- [x] 데이터가 커져 URL이 길어질 경우에 대한 처리(공유 범위를 루트/일정으로 제한하는 등)가 적용된다.

## Constraints

별도 백엔드 없이 일정 데이터를 URL에 인코딩하는 방식으로 구현한다(스펙의 가정). 근거: [italy-travel-planner 스펙의 남은 리스크](../spec.md#남은-리스크) — URL 길이 제한 가능성.

## Verification

- 생성된 URL을 다시 파싱했을 때 원본 루트/일정과 동일한 데이터가 복원되는지 테스트.
- 체크리스트·예산 등 데이터가 큰 시나리오에서 URL 길이 처리가 의도대로 동작하는지 확인.

## Review checkpoint

None.

## Status

completed

## Execution

- Verification: `vitest run`(왕복 변환, 큐레이션 밖 도시 필터링, 6곳 상한, URL 길이 테스트 포함), `tsc --noEmit`, `eslint` 모두 통과. 브라우저에서 실제로 "공유 링크 만들기"로 만든 URL을 복사해 localStorage를 지운 뒤 그 URL로 열어, 로그인 없이 같은 루트("추천 루트"·"일자별 일정" 둘 다)가 그대로 보이는 것을 확인. 필수 지역(mustVisit)이 있는 링크도 동일하게 확인.
- Blocker: —
- Revision: `code-review low` 1회 — 체크박스 UI가 강제하는 "필수 지역 최대 6곳" 규칙이 URL을 직접 조작해 넘어온 값에는 적용되지 않는 것을 발견해 `parseSharedTrip`에도 같은 상한을 적용. 공유 범위는 체크리스트·예산처럼 커질 수 있는 데이터를 애초에 담지 않고 루트 관련 값(도착/출발·필수 지역 최대 6곳)만 담는 방식으로, 데이터가 늘어나 URL이 길어지는 문제 자체가 생기지 않게 설계했다.
