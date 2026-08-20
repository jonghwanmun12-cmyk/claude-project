import { describe, expect, it } from "vitest";

import { CITIES } from "@/lib/travel-data";
import { buildShareUrl, parseSharedTrip } from "@/lib/share-link";
import type { StoredTrip } from "@/lib/trip-storage";

const SAMPLE: StoredTrip = {
  arrivalCityId: "rome",
  arrivalDateTime: "2026-09-10T14:00",
  departureCityId: "venice",
  departureDateTime: "2026-09-18T09:00",
  mustVisitCityIds: ["florence", "milan"],
};

describe("buildShareUrl / parseSharedTrip", () => {
  it("만든 URL을 다시 파싱하면 원본 여행 입력값과 같다", () => {
    const url = buildShareUrl(SAMPLE, "https://example.com", "/");
    const search = new URL(url).search;

    expect(parseSharedTrip(search)).toEqual(SAMPLE);
  });

  it("필수 지역이 없는 여행도 왕복 변환된다", () => {
    const trip: StoredTrip = { ...SAMPLE, mustVisitCityIds: [] };
    const url = buildShareUrl(trip, "https://example.com", "/");

    expect(parseSharedTrip(new URL(url).search)).toEqual(trip);
  });

  it("필수 값이 하나라도 없으면 null을 준다", () => {
    expect(parseSharedTrip("?arrival=rome&arrivalAt=2026-09-10T14:00")).toBeNull();
  });

  it("큐레이션 목록 밖의 도시가 있으면 null을 준다", () => {
    expect(
      parseSharedTrip(
        "?arrival=seoul&arrivalAt=2026-09-10T14:00&departure=venice&departureAt=2026-09-18T09:00"
      )
    ).toBeNull();
  });

  it("필수 지역 중 큐레이션 목록 밖 값만 걸러낸다", () => {
    const search =
      "?arrival=rome&arrivalAt=2026-09-10T14:00&departure=venice&departureAt=2026-09-18T09:00&mustVisit=florence,seoul,milan";

    expect(parseSharedTrip(search)?.mustVisitCityIds).toEqual(["florence", "milan"]);
  });

  it("직접 조작한 링크로 필수 지역을 7곳 넘게 줘도 6곳까지만 받는다", () => {
    const search =
      "?arrival=rome&arrivalAt=2026-09-10T14:00&departure=venice&departureAt=2026-09-18T09:00" +
      "&mustVisit=florence,milan,naples,bologna,verona,pisa,turin";

    expect(parseSharedTrip(search)?.mustVisitCityIds).toEqual([
      "florence",
      "milan",
      "naples",
      "bologna",
      "verona",
      "pisa",
    ]);
  });

  it("최악의 경우(필수 지역 6곳)에도 URL이 안전하게 짧다", () => {
    const worstCase: StoredTrip = {
      ...SAMPLE,
      mustVisitCityIds: CITIES.filter((c) => c.id !== "rome" && c.id !== "venice")
        .slice(0, 6)
        .map((c) => c.id),
    };
    const url = buildShareUrl(worstCase, "https://example.com", "/");

    // 일반적인 브라우저/공유 플랫폼의 URL 길이 제한(수천 자)에 크게 못 미친다.
    expect(url.length).toBeLessThan(300);
  });
});
