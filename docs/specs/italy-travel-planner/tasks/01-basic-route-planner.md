# 01 — 여행 플래너: 기본 루트 추천

## Outcome

사용자가 도착 도시/시간과 출발 도시/시간(다른 도시여도 됨)만 입력하면, 큐레이션된 이탈리아 도시·지역 데이터를 바탕으로 도착 도시에서 시작해 출발 도시에서 끝나는 추천 루트를 받는다. 입력값과 결과 루트는 브라우저에 저장되어 재방문 시에도 유지된다.

## Blockers

None.

## Acceptance criteria

- [x] 도착 도시/시간, 출발 도시/시간을 입력하면 추천 루트가 생성된다.
- [x] 추천 루트는 도착 도시에서 시작하고 출발 도시에서 끝난다.
- [x] 포함되는 중간 도시는 큐레이션 데이터의 대표성(주요도) 기준과 체류 가능 일수에 따라 정해진다.
- [x] "꼭 가고 싶은 지역" 등 도시/지역 선택 목록에는 큐레이션 목록에 있는 도시만 나타난다.
- [x] 입력값과 생성된 루트는 브라우저에 저장되어, 같은 기기·브라우저로 다시 방문했을 때 그대로 남아 있다.

## Constraints

이동 데이터는 외부 지도/경로 API 없이 이탈리아 주요 도시·지역 20~30곳 규모의 큐레이션 정적 데이터(도시 쌍별 이동수단·시간)로 준비한다. 정확한 목록과 값은 이 태스크에서 확정한다. 근거: [data-and-booking-strategy](../../../decisions/data-and-booking-strategy.md).

## Verification

- 다양한 도착/출발 도시·시간 조합에 대해 추천 루트가 결정적으로 생성되는지 단위 테스트로 확인.
- 큐레이션 목록 밖 도시명을 입력했을 때 선택 목록에 나타나지 않는지 확인.
- 입력 후 재로드 시 입력값과 루트가 동일하게 복원되는지 확인.

## Review checkpoint

None.

## Status

completed

## Execution

- Verification: `vitest run`(20/20 통과), `tsc --noEmit`, `eslint` 모두 통과. 브라우저 프리뷰에서 입력→루트 생성, 오류 문구, 새로고침 후 값 유지를 직접 확인.
- Blocker: —
- Revision: `code-review low` 1회 실행 — formatHours의 부동소수점 반올림 버그(예: "10시간 60분")를 발견해 수정. mustVisitCityIds 6개 초과 시 조용히 잘리는 문제는 02번 태스크가 그 입력을 실제로 노출할 때까지 범위 밖이라 [must-visit-cap-truncation](../../../follow-ups/must-visit-cap-truncation.md) 후속 항목으로 남김.
