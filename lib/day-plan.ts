import { addDays, buildItinerary } from "@/lib/itinerary";
import type { RoutePlan } from "@/lib/route-planner";

export type DayPlanEntry = {
  /** 1부터 시작하는 여행 일차. */
  dayNumber: number;
  /** "YYYY-MM-DD" */
  date: string;
  cityId: string;
};

/**
 * 확정된 루트를 Day 1, Day 2... 형태로 펼친다. lib/itinerary.ts의 도시별
 * 체크인/체크아웃 구간을 그대로 쓰기 때문에, "추천 루트" 섹션에 표시되는
 * 숙소 검색 날짜와 항상 같은 날짜를 가리킨다.
 *
 * 각 체류 구간의 [checkIn, checkOut) 사이 날짜를 그 도시의 하루로 채우고,
 * 마지막으로 여행 마지막 날(출발일, 마지막 도시의 checkOut)을 마지막
 * 도시의 하루로 한 번 더 추가한다 — 그날 그 도시에서 떠나는 것도 여행
 * 일차에 포함되어야 하기 때문이다.
 */
export function buildDayPlan(
  plan: RoutePlan,
  arrivalIso: string,
  departureIso: string
): DayPlanEntry[] {
  const stays = buildItinerary(plan, arrivalIso, departureIso);
  if (stays.length === 0) return [];

  const days: DayPlanEntry[] = [];
  let dayNumber = 1;
  for (const stay of stays) {
    for (let date = stay.checkIn; date < stay.checkOut; date = addDays(date, 1)) {
      days.push({ dayNumber, date, cityId: stay.cityId });
      dayNumber++;
    }
  }

  const lastStay = stays[stays.length - 1];
  days.push({ dayNumber, date: lastStay.checkOut, cityId: lastStay.cityId });

  return days;
}
