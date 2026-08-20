import { beforeEach, describe, expect, it } from "vitest";

import { loadBudget, saveBudget } from "@/lib/budget-storage";

describe("budget-storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("저장한 카테고리별 금액을 그대로 복원한다", () => {
    saveBudget({ transport: 300000, lodging: 800000 });

    expect(loadBudget()).toEqual({ transport: 300000, lodging: 800000 });
  });

  it("저장된 값이 없으면 null을 준다", () => {
    expect(loadBudget()).toBeNull();
  });

  it("배열이 저장돼 있으면 null을 준다", () => {
    window.localStorage.setItem("italy-trip-planner:budget", JSON.stringify([1, 2, 3]));

    expect(loadBudget()).toBeNull();
  });

  it("숫자가 아니거나 유한하지 않은 값은 걸러낸다", () => {
    window.localStorage.setItem(
      "italy-trip-planner:budget",
      JSON.stringify({ transport: 100, food: "많이", other: Infinity })
    );

    expect(loadBudget()).toEqual({ transport: 100 });
  });
});
