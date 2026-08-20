"use client";

import { useEffect, useState } from "react";
import { ListChecks } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { CHECKLIST_ITEMS } from "@/lib/checklist-data";
import { loadChecklist, saveChecklist } from "@/lib/checklist-storage";

export function Checklist() {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  // 서버에는 localStorage가 없어 렌더링 시점에 바로 읽으면 하이드레이션이
  // 어긋난다(components/trip-planner.tsx와 같은 패턴). 마운트 이후에만
  // 저장된 값을 읽어와 반영한다.
  useEffect(() => {
    const stored = loadChecklist();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setCheckedIds(stored);
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    saveChecklist(checkedIds);
  }, [checkedIds, hasLoaded]);

  function toggle(id: string) {
    setCheckedIds((prev) => (prev.includes(id) ? prev.filter((existing) => existing !== id) : [...prev, id]));
  }

  return (
    <section
      aria-label="여행 준비 체크리스트"
      className="flex w-full max-w-2xl flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <SectionHeading icon={ListChecks} title="여행 준비 체크리스트" description="출국 전 놓치기 쉬운 항목을 확인하세요" />
      <ul className="flex flex-col gap-2">
        {CHECKLIST_ITEMS.map((item) => (
          <li key={item.id}>
            <label className="flex items-start gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={checkedIds.includes(item.id)}
                onChange={() => toggle(item.id)}
              />
              <span>{item.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
