# 07 — 예산 트래커

## Outcome

이동·숙소·식비 등 카테고리별 예상 비용을 입력해 예산 합계를 확인할 수 있다. 실제 결제·연동은 없다.

## Blockers

None.

## Acceptance criteria

- [x] 카테고리별 예상 비용을 입력할 수 있다.
- [x] 입력한 금액의 합계가 즉시 갱신되어 표시된다.
- [x] 새로고침 후에도 입력했던 값과 합계가 유지된다.

## Constraints

실제 결제·가격 조회 연동은 하지 않는다. 사용자가 직접 입력하는 메모 성격의 값만 다룬다.

## Verification

- 여러 카테고리 금액 입력 조합에 대해 합계 계산이 올바른지 테스트.
- 새로고침 후 값이 유지되는지 확인.

## Review checkpoint

None.

## Status

completed

## Execution

- Verification: `vitest run`(합계 계산·저장/복원 테스트 포함), `tsc --noEmit`, `eslint` 모두 통과. 브라우저에서 두 카테고리에 금액을 입력해 합계가 즉시 바뀌는 것과, 전체 새로고침 후에도 입력값·합계가 유지되는 것을 직접 확인.
- Blocker: —
- Revision: 통화는 원(KRW)으로 가정(화면 전체가 한국어 사용자 대상이라). `code-review low` 1회 — `hasLocalStorage()` 중복을 06번 태스크와 함께 `lib/local-storage.ts`로 추출해 해결.
