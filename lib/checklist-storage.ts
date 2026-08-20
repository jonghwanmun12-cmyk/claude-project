// 체크리스트 체크 상태를 브라우저 localStorage에 저장/복원한다.

import { hasLocalStorage } from "@/lib/local-storage";

const STORAGE_KEY = "italy-trip-planner:checklist";

export function saveChecklist(checkedIds: string[]): void {
  if (!hasLocalStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedIds));
}

export function loadChecklist(): string[] | null {
  if (!hasLocalStorage()) return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return null;
  }
}
