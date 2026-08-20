// 구글맵 검색 딥링크 생성. 실시간 장소 검색 API가 아니라 정적 검색 URL
// 스킴(`/maps/search/?api=1&query=...`)만 쓴다.
// 근거: docs/specs/italy-travel-planner/tasks/12-nearby-places-candidates.md,
// docs/decisions/data-and-booking-strategy.md의 딥링크 방식과 동일한 접근.

export function buildGoogleMapsSearchUrl(placeName: string, cityName: string): string {
  const params = new URLSearchParams({ api: "1", query: `${placeName} ${cityName}` });
  return `https://www.google.com/maps/search/?${params.toString()}`;
}
