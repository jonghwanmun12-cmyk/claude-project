# computeRoute가 필수 지역 7곳 이상을 조용히 잘라낸다

`lib/route-planner.ts`의 `computeRoute`에서 `mustVisitCityIds`가 6개를
넘으면 `forcedVia.slice(0, MAX_VIA_CITIES)`로 나머지를 조용히 버린다.
현재(01번 태스크)는 UI에서 필수 지역 선택을 노출하지 않아 문제가 되지
않지만, 02번 태스크(심화 루트)에서 다중 선택 UI를 붙일 때는 사용자가
7곳 이상을 고르면 일부가 사용자에게 알림 없이 빠지게 된다.

제안: 02번 태스크 구현 시 선택 가능한 지역 수를 6개로 제한하거나,
초과 선택 시 안내 메시지를 보여주는 처리를 추가한다.
