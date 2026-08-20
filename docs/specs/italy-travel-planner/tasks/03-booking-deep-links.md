# 03 — 구간별 예약 딥링크

## Outcome

확정된 루트의 각 구간마다 이동수단 검색 링크와 숙소 검색 링크가 표시된다. 숙소 링크는 목적지·체크인/체크아웃 날짜가 채워진 Booking.com 검색 결과로, 이동수단 링크는 Trenitalia 홈페이지로 새 탭에서 열리며 구간의 도시·날짜는 화면에 텍스트로 표시된다.

## Blockers

01-basic-route-planner — 링크를 붙일 확정된 루트/구간이 있어야 한다.

## Acceptance criteria

- [x] 루트의 각 구간마다 이동수단 검색 링크가 최소 하나 표시된다.
- [x] 루트의 각 구간마다 숙소 검색 링크가 최소 하나 표시된다.
- [x] 숙소 링크를 클릭하면 해당 구간의 목적지 도시와 체크인/체크아웃 날짜가 반영된 Booking.com 검색 결과 페이지가 새 탭으로 열린다.
- [x] 이동수단 링크를 클릭하면 Trenitalia 홈페이지가 새 탭으로 열리고, 그 구간의 도시·날짜는 화면에 텍스트로 표시된다.
- [x] 심화 루트(02)로 재계산된 구간에도 동일하게 링크가 표시된다.

## Constraints

실제 예약·결제는 이 태스크에서 처리하지 않는다. 딥링크로 외부 사이트에 연결하는 것까지만 다룬다. 근거: [data-and-booking-strategy](../../../decisions/data-and-booking-strategy.md).

각 도시의 체크인/체크아웃 날짜는 정확한 일자별 일정(태스크 04)이 아니라, 도착~출발 사이를 도시 수만큼 고르게 나눈 근사치로 계산한다(`lib/itinerary.ts`). 도시마다 최소 1박을 보장하기 때문에 아주 짧은 여행(체류 일수 < 도시 수)에서는 마지막 도시의 checkout이 실제 출발일보다 하루 늦게 나올 수 있다 — 검색 결과의 시작점일 뿐이라 사용자가 그 사이트에서 직접 조정 가능하므로 허용한다.

## Verification

- 각 구간에 대해 생성된 Booking.com URL의 도시·checkin·checkout 파라미터가 해당 구간의 값과 일치하는지 테스트.
- 이동수단 링크가 Trenitalia 홈페이지를 가리키는지, 화면에 구간의 도시·날짜 텍스트가 함께 표시되는지 확인.
- 심화 루트(필수 지역 포함)로 재계산된 구간에도 링크가 표시되는지 확인.

## Review checkpoint

None.

당초 "실제 검색 URL 형식이 검증되지 않은 외부 계약"을 이유로 리뷰 체크포인트를 예정했으나, 구현 전에 Trenitalia/Lefrecce/Trainline/Google Maps/Booking.com에 직접 접속해 실제 동작을 확인했다(증거: [data-and-booking-strategy](../../../decisions/data-and-booking-strategy.md)의 Evidence worth preserving). 검증되지 않은 가정으로 남는 부분이 없어 별도 리뷰 없이 code-review low 1회로 충분하다고 판단.

## Status

completed

## Execution

- Verification: `vitest run`(31/31 통과, Booking.com URL 파라미터·Trenitalia 링크 테스트 포함), `tsc --noEmit`, `eslint` 모두 통과. 브라우저에서 로마→나폴리→피렌체→밀란→베네치아 루트의 모든 구간에 숙소·이동수단 링크가 뜨는 것, 실제 Booking.com URL로 나폴리 호텔 목록이 뜨는 것, Trenitalia 홈페이지가 실제로 열리는 것을 직접 확인.
- Blocker: —
- Revision: Skyscanner·정확한 날짜 URL 전달을 전제한 원래 접근을 실제 접속 확인 결과에 따라 변경. 숙소는 Booking.com(ss/checkin/checkout, 검증됨), 이동수단은 Trenitalia 홈페이지+화면 텍스트로 바꿨고, 이 결정을 spec.md와 data-and-booking-strategy.md에도 반영. 애초 계획했던 리뷰 체크포인트는 사전 검증으로 목적을 이미 달성해 제거. `code-review low` 1회 — findings 없음.
