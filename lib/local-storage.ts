/** 서버 렌더링 중이거나 localStorage를 지원하지 않는 환경인지 확인한다. */
export function hasLocalStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}
