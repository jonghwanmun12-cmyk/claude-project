import { computeNights, type RoutePlan } from "@/lib/route-planner";

/** "YYYY-MM-DDTHH:mm" 형태의 datetime-local 값에서 날짜 부분만 뗀다. */
function toDateOnly(iso: string): string {
  return iso.slice(0, 10);
}

/** "YYYY-MM-DD"에 일 수를 더한다(음수도 가능). lib/day-plan.ts에서도 쓴다. */
export function addDays(dateOnly: string, days: number): string {
  const [year, month, day] = dateOnly.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export type CityStay = {
  cityId: string;
  /** 이 도시에 도착하는 날("YYYY-MM-DD"). 예약 사이트 checkin에 대응한다. */
  checkIn: string;
  /** 이 도시를 떠나는 날("YYYY-MM-DD"). 예약 사이트 checkout에 대응한다. */
  checkOut: string;
};

/**
 * 루트의 각 도시에 머무는 날짜 구간을 만든다. 실제 예약 사이트로 보낼
 * checkin/checkout을 채우기 위한 값이라, 정확한 일정표(태스크 04의
 * 일자별 뷰)라기보다 "출발/도착일 사이를 도시 수만큼 고르게 나눈 근사치"에
 * 가깝다 — 사용자가 검색 결과 페이지에서 직접 조정할 수 있다.
 *
 * 체류 일수가 도시 수보다 적은 아주 짧은 여행(예: 1박에 2개 도시)에서는
 * 도시마다 최소 1박을 보장하기 때문에, 마지막 도시의 checkout이 실제
 * 출발일보다 하루 늦게 나올 수 있다. 근사치이므로 허용한다.
 */
export function buildItinerary(
  plan: RoutePlan,
  arrivalIso: string,
  departureIso: string
): CityStay[] {
  const cityIds = plan.cityIds;
  if (cityIds.length === 0) return [];

  const totalNights = computeNights(arrivalIso, departureIso);
  const base = Math.floor(totalNights / cityIds.length);
  const extra = totalNights % cityIds.length;

  let cursor = toDateOnly(arrivalIso);
  return cityIds.map((cityId, index) => {
    const nights = Math.max(1, base + (index < extra ? 1 : 0));
    const checkIn = cursor;
    const checkOut = addDays(cursor, nights);
    cursor = checkOut;
    return { cityId, checkIn, checkOut };
  });
}
