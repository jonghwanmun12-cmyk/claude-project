# 12 — 내 위치 주변 정보 후보군 확장 + 구글맵 링크

## Outcome

"내 위치 주변 정보"에서 맛집·관광지가 각각 하나가 아니라 여러 후보로 표시되고, 각 후보에는 구글맵 검색 결과로 새 탭에서 연결되는 버튼이 붙는다.

## Blockers

None.

## Acceptance criteria

- [ ] 표시되는 도시마다 관광지 후보와 맛집 후보가 각각 최소 2개 이상 나열된다(큐레이션 데이터 범위 안에서).
- [ ] 각 후보 항목에 "구글맵에서 보기"류 버튼이 있고, 누르면 그 장소를 검색하는 구글맵 페이지가 새 탭에서 열린다.
- [ ] 도시를 바꾸면(직접 선택 또는 GPS 판별) 그 도시의 후보 목록과 각 링크도 함께 바뀐다.
- [ ] 항목에 연결된 이미지가 깨져도 항목 자체와 구글맵 링크 버튼은 계속 보이고, 이미지 자리에만 대체 표시가 나온다(기존 동작 유지).

## Constraints

- 구글맵 링크는 정적 검색 딥링크(`https://www.google.com/maps/search/?api=1&query=...`)를 쓰고, 장소명과 도시명을 쿼리로 채운다. 실시간 장소 검색 API는 쓰지 않는다.
- 후보 데이터는 `lib/nearby-places-data.ts`를 확장하는 방식으로 큐레이션하며, 13번 태스크(일자별 일정)에서도 같은 데이터를 재사용한다.

## Verification

- 각 큐레이션 도시에 대해 관광지·맛집 후보가 각각 2개 이상 있는지, 각 후보의 구글맵 링크 URL이 장소명·도시명을 포함하는지 테스트.
- 이미지 깨짐 시 대체 표시와 링크 버튼이 함께 정상 동작하는지 확인.

## Review checkpoint

None.

## Status

completed

## Execution

- Verification: `bun run test`(신규 `lib/nearby-places-data.test.ts`, `lib/google-maps-link.test.ts`, `app/page.test.tsx` 통합 검증 포함 77개 통과), `bun run lint`, `bun run typecheck` 통과. `next dev` 브라우저에서 로마 기준 "관광지 후보"/"맛집 후보" 각 3개씩과 "구글맵에서 보기" 링크(새 탭)를 확인.
- Blocker: 없음.
- Revision: 큐레이션 도시 10곳 모두 관광지·맛집을 각 3개로 확장(기존 1개씩 → 3개씩)했고, 카드 UI를 `components/place-card.tsx`로 분리해 13번 태스크(일자별 일정)에서 재사용할 수 있게 했다.
- Revision(2026-08-20): 이미지 깨짐 지적에 따라 `lib/nearby-places-data.ts` 이미지 60개를 Wikimedia Commons 검색 API로 실존 확인한 파일명으로 교체했다. 사용자 요청으로 돌로미티·아말피 해안 2개 도시를 추가해 관광지·맛집 후보를 각 3개씩 채웠다.
