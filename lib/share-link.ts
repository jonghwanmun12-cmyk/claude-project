// 일정 공유 링크. 근거: docs/specs/italy-travel-planner/spec.md의 가정·남은 리스크
//
// 별도 백엔드 없이 URL 쿼리스트링에 여행 입력값을 직접 인코딩한다. 체크리스트나
// 예산처럼 항목 수가 늘어날 수 있는 데이터는 애초에 담지 않고, 루트를 결정하는
// 값(도착/출발 도시·시간, 필수 지역 최대 6곳)만 담는다 — 각 값의 길이가
// 정해져 있어 URL이 브라우저 길이 제한에 걸릴 일이 없다.
import { MAX_VIA_CITIES } from "@/lib/route-planner";
import { isCuratedCity } from "@/lib/travel-data";
import type { StoredTrip } from "@/lib/trip-storage";

const PARAM_ARRIVAL_CITY = "arrival";
const PARAM_ARRIVAL_TIME = "arrivalAt";
const PARAM_DEPARTURE_CITY = "departure";
const PARAM_DEPARTURE_TIME = "departureAt";
const PARAM_MUST_VISIT = "mustVisit";

export function buildShareUrl(trip: StoredTrip, origin: string, pathname: string): string {
  const params = new URLSearchParams({
    [PARAM_ARRIVAL_CITY]: trip.arrivalCityId,
    [PARAM_ARRIVAL_TIME]: trip.arrivalDateTime,
    [PARAM_DEPARTURE_CITY]: trip.departureCityId,
    [PARAM_DEPARTURE_TIME]: trip.departureDateTime,
  });
  if (trip.mustVisitCityIds.length > 0) {
    params.set(PARAM_MUST_VISIT, trip.mustVisitCityIds.join(","));
  }
  return `${origin}${pathname}?${params.toString()}`;
}

/**
 * 공유 링크의 쿼리스트링(예: "?arrival=rome&...")에서 여행 입력값을
 * 복원한다. 필수 값이 없거나 큐레이션 목록 밖 도시가 섞여 있으면 null을
 * 준다 — 이 경우 호출부는 평소처럼 localStorage 값이나 기본값을 쓴다.
 */
export function parseSharedTrip(search: string): StoredTrip | null {
  const params = new URLSearchParams(search);
  const arrivalCityId = params.get(PARAM_ARRIVAL_CITY);
  const arrivalDateTime = params.get(PARAM_ARRIVAL_TIME);
  const departureCityId = params.get(PARAM_DEPARTURE_CITY);
  const departureDateTime = params.get(PARAM_DEPARTURE_TIME);

  if (!arrivalCityId || !arrivalDateTime || !departureCityId || !departureDateTime) {
    return null;
  }
  if (!isCuratedCity(arrivalCityId) || !isCuratedCity(departureCityId)) {
    return null;
  }

  const mustVisitRaw = params.get(PARAM_MUST_VISIT);
  // 체크박스 UI가 MAX_VIA_CITIES까지만 고를 수 있게 막는 것과 똑같이,
  // 직접 조작한 링크로 그 이상을 넘겨받는 경우도 여기서 상한을 맞춘다.
  const mustVisitCityIds = mustVisitRaw
    ? mustVisitRaw.split(",").filter((id) => isCuratedCity(id)).slice(0, MAX_VIA_CITIES)
    : [];

  return { arrivalCityId, arrivalDateTime, departureCityId, departureDateTime, mustVisitCityIds };
}
