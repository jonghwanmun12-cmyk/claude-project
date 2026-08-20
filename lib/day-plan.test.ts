import { describe, expect, it } from "vitest";

import { buildDayPlan, computeDayStayPositions } from "@/lib/day-plan";
import type { RoutePlan } from "@/lib/route-planner";

function plan(cityIds: string[]): RoutePlan {
  const legs = cityIds.slice(0, -1).map((from, i) => ({ from, to: cityIds[i + 1], hours: 1 }));
  return { cityIds, legs, totalHours: legs.length };
}

describe("buildDayPlan", () => {
  it("체류 일수 + 1일치의 Day를 만든다(도착일부터 출발일까지)", () => {
    const days = buildDayPlan(plan(["rome", "florence", "venice"]), "2026-09-10T14:00", "2026-09-16T09:00");

    expect(days).toHaveLength(7); // 6박 + 출발일
    expect(days[0]).toEqual({ dayNumber: 1, date: "2026-09-10", cityId: "rome" });
    expect(days.at(-1)).toEqual({ dayNumber: 7, date: "2026-09-16", cityId: "venice" });
  });

  it("도시별 체류 구간과 일치하게 도시가 배정된다(lib/itinerary.ts와 같은 경계)", () => {
    const days = buildDayPlan(plan(["rome", "florence", "venice"]), "2026-09-10T14:00", "2026-09-16T09:00");
    // rome: 9/10~9/12(2박), florence: 9/12~9/14(2박), venice: 9/14~9/16(2박) + 출발일 9/16
    const byDate = Object.fromEntries(days.map((d) => [d.date, d.cityId]));

    expect(byDate["2026-09-10"]).toBe("rome");
    expect(byDate["2026-09-11"]).toBe("rome");
    expect(byDate["2026-09-12"]).toBe("florence");
    expect(byDate["2026-09-13"]).toBe("florence");
    expect(byDate["2026-09-14"]).toBe("venice");
    expect(byDate["2026-09-15"]).toBe("venice");
    expect(byDate["2026-09-16"]).toBe("venice");
  });

  it("일차 번호는 1부터 끊기지 않고 이어진다", () => {
    const days = buildDayPlan(plan(["rome", "milan", "naples", "venice"]), "2026-09-10T14:00", "2026-09-19T09:00");

    days.forEach((day, index) => expect(day.dayNumber).toBe(index + 1));
  });

  it("도시가 하나뿐이면 도착일부터 출발일까지 모두 그 도시다", () => {
    const days = buildDayPlan(plan(["milan"]), "2026-09-10T14:00", "2026-09-13T09:00");

    expect(days.map((d) => d.date)).toEqual(["2026-09-10", "2026-09-11", "2026-09-12", "2026-09-13"]);
    expect(days.every((d) => d.cityId === "milan")).toBe(true);
  });
});

describe("computeDayStayPositions", () => {
  it("같은 도시가 연속되는 구간을 하나의 체류로 묶어 순번을 매긴다", () => {
    const days = buildDayPlan(plan(["rome", "florence", "venice"]), "2026-09-10T14:00", "2026-09-16T09:00");
    const positions = computeDayStayPositions(days);

    // rome: 2일(9/10,9/11), florence: 2일, venice: 3일(9/14,9/15,9/16 출발일 포함)
    expect(positions[0]).toEqual({ dayIndexInStay: 0, totalDaysInStay: 2 });
    expect(positions[1]).toEqual({ dayIndexInStay: 1, totalDaysInStay: 2 });
    expect(positions[2]).toEqual({ dayIndexInStay: 0, totalDaysInStay: 2 });
    expect(positions[3]).toEqual({ dayIndexInStay: 1, totalDaysInStay: 2 });
    expect(positions[4]).toEqual({ dayIndexInStay: 0, totalDaysInStay: 3 });
    expect(positions[5]).toEqual({ dayIndexInStay: 1, totalDaysInStay: 3 });
    expect(positions[6]).toEqual({ dayIndexInStay: 2, totalDaysInStay: 3 });
  });

  it("도시가 하나뿐이면 전체가 하나의 체류 구간이다", () => {
    const days = buildDayPlan(plan(["milan"]), "2026-09-10T14:00", "2026-09-13T09:00");
    const positions = computeDayStayPositions(days);

    expect(positions).toEqual([
      { dayIndexInStay: 0, totalDaysInStay: 4 },
      { dayIndexInStay: 1, totalDaysInStay: 4 },
      { dayIndexInStay: 2, totalDaysInStay: 4 },
      { dayIndexInStay: 3, totalDaysInStay: 4 },
    ]);
  });

  it("도착지와 출발지가 같은 도시라 왕복으로 두 번 나뉘어 방문해도 이어서 센다", () => {
    // 로마(2일)→피렌체(2일)→로마(2일) 형태의 왕복 루트.
    const days = buildDayPlan(plan(["rome", "florence", "rome"]), "2026-09-10T14:00", "2026-09-16T09:00");
    const positions = computeDayStayPositions(days);

    const romeDays = days
      .map((day, index) => ({ day, position: positions[index] }))
      .filter(({ day }) => day.cityId === "rome");

    const total = romeDays.length;
    expect(romeDays.map(({ position }) => position.dayIndexInStay)).toEqual(
      Array.from({ length: total }, (_, i) => i)
    );
    expect(romeDays.every(({ position }) => position.totalDaysInStay === total)).toBe(true);
    // 왕복 두 구간(초반 로마, 후반 로마) 모두에 로마 날짜가 있어야 의미 있는 테스트다.
    expect(romeDays.length).toBeGreaterThan(2);
  });
});
