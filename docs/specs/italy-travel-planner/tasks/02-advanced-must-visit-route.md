# 02 — 여행 플래너: 심화 루트(필수 지역 포함)

## Outcome

사용자가 큐레이션 목록 중 꼭 가고 싶은 지역을 다중 선택하면, 그 지역들을 모두 포함하면서 총 이동 시간이 합리적으로 짧은 순서로 배열된 최적 루트를 받는다.

## Blockers

01-basic-route-planner — 기본 루트 산출 로직과 화면을 확장하는 작업이라 기본 루트 기능이 먼저 있어야 한다.

## Acceptance criteria

- [x] 큐레이션 목록 중 하나 이상의 지역을 선택할 수 있다.
- [x] 선택한 지역을 하나 이상 지정하면, 생성되는 루트는 선택한 지역을 모두 포함한다.
- [x] 필수 지역을 포함한 루트는 도착 도시에서 시작하고 출발 도시에서 끝난다.
- [x] 선택한 지역 조합을 바꾸면 루트가 다시 계산되어 갱신된다.

## Constraints

여러 대안 루트를 제시하지 않고 하나의 추천 루트만 보여준다.

## Verification

- 서로 다른 필수 지역 선택 조합에 대해, 결과 루트가 선택한 지역을 모두 포함하는지 테스트.
- 필수 지역 선택을 비웠을 때 01의 기본 루트 동작으로 되돌아가는지 확인.

## Review checkpoint

None.

## Status

completed

## Execution

- Verification: `vitest run`(24/24 통과, 조합별 필수 지역 테스트·6곳 상한 테스트 포함), `tsc --noEmit`, `eslint` 모두 통과. 브라우저 프리뷰에서 토리노 단독 선택, 7곳 선택 시 6곳 상한/안내문/체크박스 비활성화, 해제 시 재활성화를 직접 확인.
- Blocker: —
- Revision: 01번 태스크의 `MAX_VIA_CITIES` 상수를 export해 UI 선택 상한과 라우팅 로직이 같은 값을 쓰게 함 — [must-visit-cap-truncation](../../../follow-ups/must-visit-cap-truncation.md) 후속 항목에서 제안한 대로 처리하고 해당 파일은 삭제.
