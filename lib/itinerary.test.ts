import { describe, expect, it } from "vitest";

import { buildItinerary } from "@/lib/itinerary";
import type { RoutePlan } from "@/lib/route-planner";

function plan(cityIds: string[]): RoutePlan {
  const legs = cityIds.slice(0, -1).map((from, i) => ({ from, to: cityIds[i + 1], hours: 1 }));
  return { cityIds, legs, totalHours: legs.length };
}

describe("buildItinerary", () => {
  it("도착일부터 도시 수만큼 체류 구간을 순서대로 나눈다", () => {
    const stays = buildItinerary(plan(["rome", "florence", "venice"]), "2026-09-10T14:00", "2026-09-16T09:00");

    expect(stays).toHaveLength(3);
    expect(stays[0]).toEqual({ cityId: "rome", checkIn: "2026-09-10", checkOut: "2026-09-12" });
    expect(stays[1]).toEqual({ cityId: "florence", checkIn: "2026-09-12", checkOut: "2026-09-14" });
    expect(stays[2]).toEqual({ cityId: "venice", checkIn: "2026-09-14", checkOut: "2026-09-16" });
  });

  it("한 도시의 checkout은 다음 도시의 checkin과 같다(구간이 끊기지 않는다)", () => {
    const stays = buildItinerary(plan(["rome", "milan", "naples", "venice"]), "2026-09-10T14:00", "2026-09-19T09:00");

    for (let i = 0; i < stays.length - 1; i++) {
      expect(stays[i].checkOut).toBe(stays[i + 1].checkIn);
    }
  });

  it("도시가 하나뿐이면 도착일과 출발일 사이 전체를 그 도시의 체류로 준다", () => {
    const stays = buildItinerary(plan(["milan"]), "2026-09-10T14:00", "2026-09-13T09:00");

    expect(stays).toEqual([{ cityId: "milan", checkIn: "2026-09-10", checkOut: "2026-09-13" }]);
  });

  it("체류 일수가 도시 수보다 적어도 도시마다 최소 1박은 보장한다", () => {
    const stays = buildItinerary(plan(["rome", "venice"]), "2026-09-10T14:00", "2026-09-11T09:00");

    expect(stays[0]).toEqual({ cityId: "rome", checkIn: "2026-09-10", checkOut: "2026-09-11" });
    // 1박짜리 여행에 도시가 2곳이라 마지막 도시의 checkout은 실제 출발일(9/11)보다
    // 하루 늦게 나오는 근사치다 — buildItinerary의 문서화된 트레이드오프.
    expect(stays[1]).toEqual({ cityId: "venice", checkIn: "2026-09-11", checkOut: "2026-09-12" });
  });
});
