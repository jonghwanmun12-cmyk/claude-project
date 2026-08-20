# 08 — 일정 공유 링크

## Outcome

"공유 링크 만들기"를 누르면 URL이 생성되고, 그 URL을 다른 브라우저에서 로그인 없이 열면 같은 루트와 일자별 일정을 볼 수 있다.

## Blockers

04-day-by-day-view-export — 공유 상대가 보게 될 화면이 일자별 일정 뷰이므로, 그 화면이 먼저 있어야 한다.

## Acceptance criteria

- [ ] "공유 링크 만들기"를 누르면 URL이 생성된다.
- [ ] 생성된 URL을 다른 브라우저(로그인 없이)에서 열면 원본과 같은 루트/일자별 일정이 표시된다.
- [ ] 데이터가 커져 URL이 길어질 경우에 대한 처리(공유 범위를 루트/일정으로 제한하는 등)가 적용된다.

## Constraints

별도 백엔드 없이 일정 데이터를 URL에 인코딩하는 방식으로 구현한다(스펙의 가정). 근거: [italy-travel-planner 스펙의 남은 리스크](../spec.md#남은-리스크) — URL 길이 제한 가능성.

## Verification

- 생성된 URL을 다시 파싱했을 때 원본 루트/일정과 동일한 데이터가 복원되는지 테스트.
- 체크리스트·예산 등 데이터가 큰 시나리오에서 URL 길이 처리가 의도대로 동작하는지 확인.

## Review checkpoint

None.

## Status

pending

## Execution

- Verification: —
- Blocker: —
- Revision: —
