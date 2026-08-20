import { beforeEach, describe, expect, it } from "vitest";

import { loadChecklist, saveChecklist } from "@/lib/checklist-storage";

describe("checklist-storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("저장한 체크 목록을 그대로 복원한다", () => {
    saveChecklist(["passport-validity", "esim"]);

    expect(loadChecklist()).toEqual(["passport-validity", "esim"]);
  });

  it("저장된 값이 없으면 null을 준다", () => {
    expect(loadChecklist()).toBeNull();
  });

  it("배열이 아닌 값이 저장돼 있으면 null을 준다", () => {
    window.localStorage.setItem("italy-trip-planner:checklist", JSON.stringify({ not: "an array" }));

    expect(loadChecklist()).toBeNull();
  });

  it("문자열이 아닌 항목은 걸러낸다", () => {
    window.localStorage.setItem("italy-trip-planner:checklist", JSON.stringify(["esim", 42, null]));

    expect(loadChecklist()).toEqual(["esim"]);
  });
});
