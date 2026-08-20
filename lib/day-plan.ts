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

export type DayStayPosition = {
  /** 전체 일정에서 이 도시를 몇 번째로 맞이하는 날인지(0부터 시작). 도착지와
   * 출발지가 같은 도시라 그 도시를 두 번(왕복 시작/끝) 방문하는 경우처럼,
   * 방문이 여러 구간으로 나뉘어도 전체 일정 기준으로 이어서 센다. */
  dayIndexInStay: number;
  /** 전체 일정에서 이 도시에 머무는 날의 총 수(구간이 나뉘어도 합산). */
  totalDaysInStay: number;
};

/**
 * 일자별 일정에서 같은 도시에 머무는 날이 전체 몇 번째·총 며칠인지 계산한다.
 * 같은 도시가 연속된 구간뿐 아니라(예: Day1~2 로마) 왕복 등으로 떨어져서
 * 다시 나오는 경우(예: Day7~8도 로마)까지 전부 하나로 묶어서 센다 — 그래야
 * Day 카드가 같은 도시에 여러 날 머물 때(구간이 나뉘어 있어도) 서로 다른
 * 관광지·맛집 후보를 보여줄 수 있다(lib/nearby-places-data.ts의
 * getDayHighlights와 함께 사용).
 */
export function computeDayStayPositions(days: DayPlanEntry[]): DayStayPosition[] {
  const totalByCity = new Map<string, number>();
  for (const day of days) {
    totalByCity.set(day.cityId, (totalByCity.get(day.cityId) ?? 0) + 1);
  }

  const seenByCity = new Map<string, number>();
  return days.map((day) => {
    const dayIndexInStay = seenByCity.get(day.cityId) ?? 0;
    seenByCity.set(day.cityId, dayIndexInStay + 1);
    return { dayIndexInStay, totalDaysInStay: totalByCity.get(day.cityId)! };
  });
}
