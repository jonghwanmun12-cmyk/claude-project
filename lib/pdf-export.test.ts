import { describe, expect, it } from "vitest";

import { buildDayPlan } from "@/lib/day-plan";
import { buildDayPlanLines, buildDayPlanPdfBlob } from "@/lib/pdf-export";
import type { RoutePlan } from "@/lib/route-planner";

const CITY_NAMES_EN: Record<string, string> = { rome: "Rome", florence: "Florence", venice: "Venice" };
const cityNameEn = (id: string) => CITY_NAMES_EN[id] ?? id;

function plan(cityIds: string[]): RoutePlan {
  const legs = cityIds.slice(0, -1).map((from, i) => ({ from, to: cityIds[i + 1], hours: 1 }));
  return { cityIds, legs, totalHours: legs.length };
}

describe("buildDayPlanLines", () => {
  it("화면 일정(dayPlan)과 같은 날짜·도시로 한 줄씩 만든다", () => {
    const days = buildDayPlan(plan(["rome", "florence", "venice"]), "2026-09-10T14:00", "2026-09-16T09:00");
    const lines = buildDayPlanLines(days, cityNameEn);

    expect(lines).toHaveLength(days.length);
    expect(lines[0]).toBe("Day 1 (2026-09-10): Rome");
    expect(lines.at(-1)).toBe("Day 7 (2026-09-16): Venice");
  });
});

describe("buildDayPlanPdfBlob", () => {
  it("PDF MIME 타입을 가진 비어 있지 않은 Blob을 만든다", () => {
    const days = buildDayPlan(plan(["rome", "florence", "venice"]), "2026-09-10T14:00", "2026-09-16T09:00");
    const blob = buildDayPlanPdfBlob(days, cityNameEn);

    expect(blob.type).toBe("application/pdf");
    expect(blob.size).toBeGreaterThan(0);
  });
});
