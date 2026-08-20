// 카테고리별 예산 입력값을 브라우저 localStorage에 저장/복원한다.

import { hasLocalStorage } from "@/lib/local-storage";

const STORAGE_KEY = "italy-trip-planner:budget";

export type BudgetAmounts = Record<string, number>;

export function saveBudget(amounts: BudgetAmounts): void {
  if (!hasLocalStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(amounts));
}

export function loadBudget(): BudgetAmounts | null {
  if (!hasLocalStorage()) return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
    const amounts: BudgetAmounts = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "number" && Number.isFinite(value)) {
        amounts[key] = value;
      }
    }
    return amounts;
  } catch {
    return null;
  }
}
