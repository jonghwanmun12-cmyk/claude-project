# 06 — 여행 준비 체크리스트

## Outcome

여권 유효기간, 유심/이심, EU 입국 규정, 필수 짐 등 여행 준비 체크리스트 항목을 확인하고 체크할 수 있다. 체크 상태는 브라우저에 저장되어 재방문 시에도 유지된다.

## Blockers

None.

## Acceptance criteria

- [x] 체크리스트 항목 목록이 표시된다.
- [x] 항목을 체크/해제할 수 있다.
- [x] 같은 브라우저로 재방문했을 때 체크 상태가 그대로 유지된다.

## Constraints

체크리스트 항목의 정확한 문구와 최신 규정은 이 태스크에서 준비한다(스펙의 가정).

## Verification

- 항목 체크 후 재로드 시 상태가 유지되는지 확인.

## Review checkpoint

None.

## Status

completed

## Execution

- Verification: `vitest run`(체크리스트 저장/복원 테스트 포함), `tsc --noEmit`, `eslint` 모두 통과. 브라우저에서 항목 체크 후 전체 새로고침해도 체크 상태가 유지되는 것을 직접 확인.
- Blocker: —
- Revision: ETIAS 등 EU 입국 규정 문구는 실제 검색으로 확인한 2026-08-20 기준 정보로 작성(정확한 시행일은 미확정이라 "확인 필요"로 남김). `code-review low` 1회 — `hasLocalStorage()` 중복 발견해 `lib/local-storage.ts`로 추출·수정(같은 리뷰가 07번 태스크의 budget-storage.ts에도 적용됨).
