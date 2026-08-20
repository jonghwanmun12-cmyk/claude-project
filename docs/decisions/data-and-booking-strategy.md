# 이동 데이터 및 예약 연동 전략

## Decisions

- 도시/지역 간 이동 정보(교통수단, 대략적인 이동 시간)는 외부 지도/경로 API를 호출하지 않고, 이탈리아 주요 도시·지역 20~30곳으로 범위를 한정한 큐레이션 정적 데이터(도시 쌍별 이동 수단·시간)로 관리한다.
- "내 위치 주변" 기능은 실시간 GPS 좌표를 받아 위 큐레이션 도시 목록 중 가장 가까운 도시로 매칭하고, 그 도시에 대해 미리 준비한 정적 맛집·관광지 목록을 보여준다.
- 항공권·숙소 예약은 자체적으로 결제/예약을 처리하지 않는다. 목적지·날짜가 미리 채워진 외부 예약 사이트 검색 결과 페이지로 연결되는 딥링크만 제공하고, 예약 완료는 사용자가 해당 사이트에서 직접 한다.
- 숙소는 Booking.com 검색 결과 딥링크(`ss`·`checkin`·`checkout` 쿼리 파라미터)를 쓴다. 기차는 도시·날짜를 URL로 전달하는 방법이 없어(아래 증거 참고) Trenitalia 홈페이지로만 연결하고, 구간의 도시·날짜는 우리 화면에 텍스트로 보여준다.

## Boundaries

- 이 결정은 여행 플래너, 주변 정보 리스트업, 예약 연결 기능 전반에 적용된다.
- 큐레이션 목록에 없는 소도시는 지원하지 않으며, GPS가 이탈리아 큐레이션 도시들과 멀리 떨어진 경우(예: 여행 전 한국에서 접속)의 동작은 스펙에서 별도로 정의한다.
- 실제 예약 체결, 결제, 가격 실시간 조회는 이 결정의 범위 밖이며 명시적으로 금지되지 않지만 채택되지 않았다.

## Why

실시간 지도/장소/예약 API는 API 키 발급, 비용, 쿼터 관리, 제휴 계약이 필요해 학습용 템플릿의 범위를 크게 벗어난다. 반면 이탈리아는 주요 여행 동선이 잘 알려져 있어 정적 데이터로도 실용적인 추천이 가능하다. 예약은 실제 결제 흐름을 자체 구현하기보다 외부 사이트로 위임하는 것이 안전하고 구현 비용도 낮다.

## Reconsider when

- 큐레이션 목록 밖의 도시/소도시 지원 요청이 반복적으로 발생할 때.
- 실시간 가격·가용성 비교가 핵심 요구사항으로 명확히 확정될 때.
- 무료 또는 저비용으로 유지 가능한 지도/장소 API 대안이 확인될 때.

## Still-rejected alternatives

- Google Maps Directions/Distance Matrix 등 실시간 경로 API 연동 — API 키 발급·비용·쿼터 관리 부담으로 기각; 학습용 템플릿 범위를 넘어선다는 이유로 재검토 보류.
- Google Places 등 실시간 주변 장소 검색 API 연동 — 위와 동일한 이유로 기각.
- 항공/호텔 예약 제휴 API(Amadeus, Booking Partner API 등)를 통한 실제 예약·결제 처리 — 제휴 계약, PCI 준수 등 준비 부담이 커서 기각; 딥링크 방식으로 대체.
- Trenitalia/Lefrecce, Trainline의 도시명+날짜 쿼리 파라미터 딥링크 — 직접 접속해 확인한 결과 기각. Trenitalia는 검색 폼 제출 시 lefrecce.it로 암호화된 `data` 토큰과 함께 리다이렉트되어 도시·날짜를 URL로 넘길 방법이 없었고, Trainline은 짐작한 쿼리 파라미터(`origin`/`destination`/`outwardDate`)로 접속하면 404였다. 두 사이트 모두 실제 검색은 자동완성으로 고른 내부 station ID(URN)를 필요로 해 외부에서 미리 채운 URL을 만들 수 없다. 홈페이지 링크 + 화면 텍스트로 대체.
- Google Maps 대중교통 길찾기 링크(`/maps/dir/?api=1&origin=...&destination=...&travelmode=transit`) — 직접 확인해보니 실제로 열리고 로마→피렌체 등 실제 Frecciarossa 열차 편도 보여주지만, 공식 문서상 특정 미래 날짜를 URL 파라미터로 넘기는 방법이 없어(항상 "지금 출발" 기준) 기각. 날짜를 URL에 반영해야 한다는 요구에 맞지 않음.

## Evidence worth preserving

- Booking.com: `https://www.booking.com/searchresults.html?ss={도시명}&checkin=YYYY-MM-DD&checkout=YYYY-MM-DD&group_adults=1&no_rooms=1` — 실제 접속해 피렌체 호텔 목록과 선택한 날짜가 그대로 반영됨을 확인(2026-08-20).
- Trenitalia: 홈페이지(`https://www.trenitalia.com`)에서 도시 검색 후 "CERCA"를 누르면 `https://www.lefrecce.it/.../handoff?data=<암호화된 토큰>`으로 리다이렉트됨을 직접 확인(2026-08-20). 이 토큰은 외부에서 구성할 수 없다.
- Trainline: `https://www.thetrainline.com/en/book/results?origin=Rome&destination=Florence&outwardDate=...` 형태로 직접 접속하면 404 페이지가 나옴을 확인(2026-08-20).
