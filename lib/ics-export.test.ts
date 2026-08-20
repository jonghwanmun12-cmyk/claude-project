import { describe, expect, it } from "vitest";

import { buildDayPlan } from "@/lib/day-plan";
import { buildIcsContent } from "@/lib/ics-export";
import type { RoutePlan } from "@/lib/route-planner";

const CITY_NAMES: Record<string, string> = { rome: "로마", florence: "피렌체", venice: "베네치아" };
const cityName = (id: string) => CITY_NAMES[id] ?? id;

function plan(cityIds: string[]): RoutePlan {
  const legs = cityIds.slice(0, -1).map((from, i) => ({ from, to: cityIds[i + 1], hours: 1 }));
  return { cityIds, legs, totalHours: legs.length };
}

describe("buildIcsContent", () => {
  it("VCALENDAR로 감싸고 하루마다 종일 VEVENT를 하나씩 만든다", () => {
    const days = buildDayPlan(plan(["rome", "florence", "venice"]), "2026-09-10T14:00", "2026-09-16T09:00");
    const ics = buildIcsContent(days, cityName);

    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.trimEnd().endsWith("END:VCALENDAR")).toBe(true);
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(days.length);
  });

  it("각 이벤트의 날짜와 도시가 화면 일정(dayPlan)과 일치한다", () => {
    const days = buildDayPlan(plan(["rome", "florence", "venice"]), "2026-09-10T14:00", "2026-09-16T09:00");
    const ics = buildIcsContent(days, cityName);

    expect(ics).toContain("DTSTART;VALUE=DATE:20260910");
    expect(ics).toContain("DTEND;VALUE=DATE:20260911");
    expect(ics).toContain("SUMMARY:Day 1: 로마");

    expect(ics).toContain("DTSTART;VALUE=DATE:20260914");
    expect(ics).toContain("SUMMARY:Day 5: 베네치아");
  });
});
