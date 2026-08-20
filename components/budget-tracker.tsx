"use client";

import { useEffect, useMemo, useState } from "react";

import { BUDGET_CATEGORIES } from "@/lib/budget-data";
import { loadBudget, saveBudget, type BudgetAmounts } from "@/lib/budget-storage";

export function BudgetTracker() {
  const [amounts, setAmounts] = useState<BudgetAmounts>({});
  const [hasLoaded, setHasLoaded] = useState(false);

  // components/trip-planner.tsx와 같은 이유로, 저장된 값은 마운트 이후에만
  // 읽어와 반영한다(하이드레이션 불일치 방지).
  useEffect(() => {
    const stored = loadBudget();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setAmounts(stored);
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    saveBudget(amounts);
  }, [amounts, hasLoaded]);

  const total = useMemo(
    () => Object.values(amounts).reduce((sum, value) => sum + value, 0),
    [amounts]
  );

  function handleChange(categoryId: string, rawValue: string) {
    if (rawValue === "") {
      setAmounts((prev) => {
        const next = { ...prev };
        delete next[categoryId];
        return next;
      });
      return;
    }
    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed)) return;
    setAmounts((prev) => ({ ...prev, [categoryId]: Math.max(0, parsed) }));
  }

  return (
    <section
      aria-label="예산 트래커"
      className="flex w-full max-w-2xl flex-col gap-4 rounded-xl border border-border bg-card p-6"
    >
      <h2 className="text-lg font-semibold text-foreground">예산 트래커</h2>
      <div className="flex flex-col gap-3">
        {BUDGET_CATEGORIES.map((category) => (
          <div key={category.id} className="flex items-center justify-between gap-3">
            <label htmlFor={`budget-${category.id}`} className="text-sm text-foreground">
              {category.label}
            </label>
            <input
              id={`budget-${category.id}`}
              type="number"
              min={0}
              inputMode="numeric"
              className="h-9 w-32 rounded-md border border-input bg-background px-2.5 text-right text-sm"
              value={amounts[category.id] ?? ""}
              onChange={(event) => handleChange(category.id, event.target.value)}
            />
          </div>
        ))}
      </div>
      <p className="text-sm font-medium text-foreground">합계: {total.toLocaleString("ko-KR")}원</p>
    </section>
  );
}
