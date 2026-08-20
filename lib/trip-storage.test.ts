import { beforeEach, describe, expect, it } from "vitest";

import { clearTrip, loadTrip, saveTrip, type StoredTrip } from "@/lib/trip-storage";

const SAMPLE: StoredTrip = {
  arrivalCityId: "rome",
  arrivalDateTime: "2026-09-10T14:00",
  departureCityId: "venice",
  departureDateTime: "2026-09-18T09:00",
  mustVisitCityIds: ["florence"],
};

describe("trip-storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("저장한 값을 그대로 복원한다", () => {
    saveTrip(SAMPLE);

    expect(loadTrip()).toEqual(SAMPLE);
  });

  it("저장된 값이 없으면 null을 준다", () => {
    expect(loadTrip()).toBeNull();
  });

  it("깨진 데이터가 있으면 null을 준다", () => {
    window.localStorage.setItem("italy-trip-planner:trip", "{이건 JSON이 아님");

    expect(loadTrip()).toBeNull();
  });

  it("clearTrip 이후에는 다시 null을 준다", () => {
    saveTrip(SAMPLE);
    clearTrip();

    expect(loadTrip()).toBeNull();
  });
});
