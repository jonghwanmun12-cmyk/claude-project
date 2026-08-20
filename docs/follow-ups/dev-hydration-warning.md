# 개발 서버에서 하이드레이션 경고가 뜬다

## 증상

`next dev`로 띄운 상태에서 아무 페이지나 새로고침하면 브라우저 콘솔에
"Hydration failed because the server rendered HTML didn't match the client"
오류가 뜬다. 화면은 React가 클라이언트에서 다시 그려 정상적으로 보이고
기능도 정상 동작한다.

## 관찰한 근거

- `italy-travel-planner` 작업을 위해 `app/page.tsx`를 바꾸기 전, `git stash`로
  원래 템플릿(`app/page.tsx`가 기본 Create Next App 화면인 상태)까지 되돌린
  뒤에도 동일한 오류가 재현됨을 확인했다. 즉 이 세션에서 추가한
  코드(`components/trip-planner.tsx`, localStorage 사용 등)와 무관하게
  이미 존재하던 문제다.
- 오류는 최초 로드/새로고침 시 1회 발생하고, 이후 상호작용에는 나타나지 않는다.

## 의심되는 원인

- Next 16 canary + React 19.2 조합, 또는 이 프리뷰 브라우저 환경이 `<html>`/`<body>`에
  주입하는 속성과의 충돌일 가능성이 있다. 정확한 원인은 확인하지 못했다.

## 시도한 것

- 원인 후보로 여행 플래너의 localStorage 초기 로딩 로직을 의심해 `useState`
  지연 초기화 대신 `useEffect` 기반 마운트 후 로딩으로 바꿔봤지만 재현
  조건(빈 localStorage 상태)에서도 동일하게 발생해 무관함을 확인했다.

## 다음 단계 제안

- 템플릿을 다루는 별도 작업에서, 브라우저 확장 없이 순수 `next dev` +
  프로덕션 빌드(`next build && next start`)로도 재현되는지 먼저 확인한다.
  재현되면 Next.js 16 canary 자체의 이슈일 수 있으니 릴리스 노트/이슈 트래커를
  확인한다.
