# 05 — 내 위치 주변 정보

## Outcome

위치 권한을 허용하면 현재 위치와 가장 가까운 큐레이션 도시의 맛집·관광지 목록과 이미지를 본다. GPS가 이탈리아 큐레이션 도시들과 멀리 떨어져 있으면 도착 도시 기준으로 목록을 보여준다. 위치 권한을 거부하거나 조회에 실패해도 도시를 직접 선택해 같은 화면을 볼 수 있다.

## Blockers

01-basic-route-planner — GPS가 이탈리아와 먼 경우의 폴백 기준이 되는 도착 도시 값이 있어야 한다.

## Acceptance criteria

- [x] 위치 권한을 허용하고 GPS가 큐레이션 도시 중 하나와 충분히 가까우면, 그 도시의 맛집·관광지 목록과 이미지가 표시된다.
- [x] GPS가 이탈리아 큐레이션 도시들과 멀리 떨어져 있으면(예: 여행 전 한국에서 접속), 근처 도시 목록 대신 현재 일정의 도착 도시 기준으로 목록이 표시된다.
- [x] 위치 권한을 거부하거나 위치 조회에 실패해도 도시를 직접 선택해 같은 맛집·관광지 목록 화면을 볼 수 있다.
- [x] 항목에 연결된 이미지가 깨지면 항목 자체는 계속 보이고, 이미지 자리에는 대체 표시가 나온다.

## Constraints

맛집·관광지·이미지는 외부 실시간 장소 검색 API 없이 큐레이션 정적 데이터로 준비한다. 이미지는 Unsplash, Wikimedia Commons 등 무료/오픈 라이선스 이미지를 사용한다(스펙의 가정; 확정 필요 시 사용자 확인). 근거: [data-and-booking-strategy](../../../decisions/data-and-booking-strategy.md).

## Verification

- 이탈리아 내 GPS 좌표, 이탈리아 밖 GPS 좌표, 권한 거부 각각에 대해 표시되는 도시와 목록이 기대값과 일치하는지 테스트.
- 이미지 URL이 깨졌을 때 대체 표시가 나오는지 확인.

## Review checkpoint

None.

## Status

completed

## Execution

- Verification: `bun run test`(60개 통과, `lib/nearest-city.test.ts` + `app/page.test.tsx`의 GPS 근접/원거리/거부 3개 시나리오와 이미지 깨짐 시나리오 포함) 및 `bun run lint`, `bun run typecheck`(무관한 기존 `app/layout.tsx` 오류 1건 제외 통과) 통과. 실제 브라우저(`next dev`)에서 위치 권한 거부 시 로마(도착 도시) 기준 목록이 뜨는 것, 도시 선택 드롭다운으로 10개 도시 전환 시 이미지가 정상 로드되는 것, 나폴리·베로나 일부 이미지가 깨졌을 때 항목은 남고 "이미지를 불러올 수 없습니다" 대체 표시가 뜨는 것을 확인.
- Blocker: 01-basic-route-planner 완료 상태이며 도착 도시 값(`trip-storage`의 `arrivalCityId`)을 그대로 폴백 기준으로 사용.
- Revision: 없음. 다만 GPS 근접 판정 임계값(150km)과 맛집·관광지 이미지 URL(Wikimedia Commons `Special:FilePath`, 파일명은 구현 시점 최선 추정)은 스펙의 가정 항목에 이미 "확정 필요"로 남아 있던 부분이라 별도 태스크 변경 없이 그대로 둠 — 관련 follow-up 기록.
- Revision(2026-08-20): 사용자가 이미지 깨짐이 많다고 지적해, 실제 파일명 추측 대신 Wikimedia Commons 검색 API로 존재를 확인한 파일명으로 전량 교체했다(`lib/nearby-places-data.ts`, `lib/city-highlights-data.ts`의 이미지 72개 전수 확인). 이 태스크의 수용 기준(이미지 깨짐 시 대체 표시)은 그대로 유지되며, 실제 깨지는 항목 수만 크게 줄었다.
