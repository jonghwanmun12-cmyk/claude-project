# 03 — 구간별 예약 딥링크

## Outcome

확정된 루트의 각 구간마다 이동수단 검색 링크와 숙소 검색 링크가 표시되고, 클릭하면 목적지·날짜가 채워진 외부 예약 사이트(예: Skyscanner, Booking.com)의 검색 결과 페이지가 새 탭으로 열린다.

## Blockers

01-basic-route-planner — 링크를 붙일 확정된 루트/구간이 있어야 한다.

## Acceptance criteria

- [ ] 루트의 각 구간마다 이동수단 검색 링크가 최소 하나 표시된다.
- [ ] 루트의 각 구간마다 숙소 검색 링크가 최소 하나 표시된다.
- [ ] 각 링크를 클릭하면 해당 구간의 목적지 도시와 날짜가 반영된 외부 사이트 검색 결과 페이지가 새 탭으로 열린다.
- [ ] 심화 루트(02, 완료된 경우)로 재계산된 구간에도 동일하게 링크가 표시된다.

## Constraints

실제 예약·결제는 이 태스크에서 처리하지 않는다. 딥링크로 외부 사이트에 연결하는 것까지만 다룬다. 근거: [data-and-booking-strategy](../../../decisions/data-and-booking-strategy.md).

## Verification

- 각 구간에 대해 생성된 URL의 도시·날짜 파라미터가 해당 구간의 값과 일치하는지 테스트.
- 링크가 새 탭으로 열리는지 확인.

## Review checkpoint

One review pass after this task.

누적 범위: 이 태스크에서 생성하는 모든 예약 딥링크(이동수단·숙소, 기본/심화 루트 전체 구간). 리스크: Skyscanner/Booking.com 등 실제 검색 URL 파라미터 형식이 아직 검증되지 않은 외부 계약이라, 결정론적 테스트만으로는 실제 사이트에서 의도한 검색 결과가 뜨는지 확인할 수 없다. 리뷰에서 실제 사이트 URL 규칙과 대조해 파라미터 형식이 맞는지 확인한다.

## Status

pending

## Execution

- Verification: —
- Blocker: —
- Revision: —
