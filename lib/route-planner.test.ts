import { describe, expect, it } from "vitest";

import { computeNights, computeRoute } from "@/lib/route-planner";

describe("computeNights", () => {
  it("도착과 출발 사이의 일수를 계산한다", () => {
    expect(
      computeNights("2026-09-10T14:00", "2026-09-18T09:00")
    ).toBe(8);
  });

  it("당일치기여도 최소 1로 clamp한다", () => {
    expect(computeNights("2026-09-10T09:00", "2026-09-10T20:00")).toBe(1);
  });
});

describe("computeRoute", () => {
  it("도착 도시에서 시작해 출발 도시에서 끝난다", () => {
    const plan = computeRoute({
      arrivalCityId: "rome",
      departureCityId: "venice",
      nights: 8,
    });

    expect(plan.cityIds[0]).toBe("rome");
    expect(plan.cityIds.at(-1)).toBe("venice");
  });

  it("필수 지역을 지정하지 않으면 대표성이 높은 도시를 우선 포함한다", () => {
    const plan = computeRoute({
      arrivalCityId: "rome",
      departureCityId: "venice",
      nights: 8,
    });

    // nights=8 -> desiredStops=4, viaCount=4-2+1=3 -> rome/venice를 뺀 상위 3개(대표성 5,4,4)
    expect(plan.cityIds).toEqual(
      expect.arrayContaining(["florence", "milan", "naples"])
    );
    expect(plan.cityIds).toHaveLength(5);
  });

  it("체류 일수가 짧으면 경유 도시 없이 직행 루트를 준다", () => {
    const plan = computeRoute({
      arrivalCityId: "rome",
      departureCityId: "venice",
      nights: 1,
    });

    expect(plan.cityIds).toEqual(["rome", "venice"]);
    expect(plan.legs).toHaveLength(1);
    expect(plan.totalHours).toBeGreaterThan(0);
  });

  it("도착과 출발이 같은 도시이고 경유 도시가 없으면 단일 도시 루트를 준다", () => {
    const plan = computeRoute({
      arrivalCityId: "milan",
      departureCityId: "milan",
      nights: 1,
    });

    expect(plan.cityIds).toEqual(["milan"]);
    expect(plan.legs).toEqual([]);
    expect(plan.totalHours).toBe(0);
  });

  it("꼭 가고 싶은 지역을 지정하면 결과 루트가 모두 포함한다", () => {
    const plan = computeRoute({
      arrivalCityId: "rome",
      departureCityId: "rome",
      nights: 5,
      mustVisitCityIds: ["florence", "verona"],
    });

    expect(plan.cityIds[0]).toBe("rome");
    expect(plan.cityIds.at(-1)).toBe("rome");
    expect(plan.cityIds).toEqual(
      expect.arrayContaining(["florence", "verona"])
    );
  });

  it("서로 다른 필수 지역 조합마다 그 지역들을 모두 포함한다", () => {
    const combos = [
      ["milan"],
      ["florence", "naples"],
      ["turin", "genoa", "bologna"],
    ];

    for (const mustVisitCityIds of combos) {
      const plan = computeRoute({
        arrivalCityId: "rome",
        departureCityId: "venice",
        nights: 10,
        mustVisitCityIds,
      });

      expect(plan.cityIds[0]).toBe("rome");
      expect(plan.cityIds.at(-1)).toBe("venice");
      expect(plan.cityIds).toEqual(expect.arrayContaining(mustVisitCityIds));
    }
  });

  it("필수 지역 선택을 비우면 대표성 기준의 기본 루트로 돌아간다", () => {
    const withEmptyMustVisit = computeRoute({
      arrivalCityId: "rome",
      departureCityId: "venice",
      nights: 8,
      mustVisitCityIds: [],
    });
    const withoutMustVisit = computeRoute({
      arrivalCityId: "rome",
      departureCityId: "venice",
      nights: 8,
    });

    expect(withEmptyMustVisit).toEqual(withoutMustVisit);
  });

  it("구간 이동시간 합이 totalHours와 같다", () => {
    const plan = computeRoute({
      arrivalCityId: "rome",
      departureCityId: "venice",
      nights: 8,
    });

    const sum = plan.legs.reduce((total, leg) => total + leg.hours, 0);
    expect(plan.totalHours).toBeCloseTo(sum);
  });

  it("찾은 순서가 임의의 다른 순서보다 이동시간이 더 길지 않다", () => {
    const plan = computeRoute({
      arrivalCityId: "rome",
      departureCityId: "venice",
      nights: 8,
    });

    // 대안: florence -> naples -> milan 순서로 방문하는 경우와 비교한다.
    const alternativeOrder = ["rome", "florence", "naples", "milan", "venice"];
    const alternativeHours =
      1.5 /* rome-florence */ +
      3 /* florence-naples */ +
      4.5 /* naples-milan */ +
      2.5 /* milan-venice */;

    expect(plan.cityIds).toEqual(expect.arrayContaining(alternativeOrder));
    expect(plan.totalHours).toBeLessThanOrEqual(alternativeHours);
  });

  it("큐레이션 목록에 없는 도시를 도착지로 주면 오류를 던진다", () => {
    expect(() =>
      computeRoute({ arrivalCityId: "seoul", departureCityId: "rome", nights: 3 })
    ).toThrow();
  });

  it("큐레이션 목록에 없는 지역을 꼭 가고 싶은 지역으로 주면 오류를 던진다", () => {
    expect(() =>
      computeRoute({
        arrivalCityId: "rome",
        departureCityId: "milan",
        nights: 3,
        mustVisitCityIds: ["seoul"],
      })
    ).toThrow();
  });
});
