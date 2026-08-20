import { Compass } from "lucide-react";

import { BudgetTracker } from "@/components/budget-tracker";
import { Checklist } from "@/components/checklist";
import { NearbyPlaces } from "@/components/nearby-places";
import { TripPlanner } from "@/components/trip-planner";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-gradient-to-b from-zinc-100 via-zinc-50 to-zinc-50 font-sans dark:from-zinc-950 dark:via-black dark:to-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col items-center gap-10 px-6 py-16">
        <header className="flex w-full flex-col items-center gap-3 rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-card px-6 py-10 text-center shadow-sm dark:from-primary/15">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <Compass className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            이탈리아 여행 플래너
          </h1>
          <p className="max-w-md text-sm text-muted-foreground sm:text-base">
            로마를 시작으로 이탈리아 구석구석을 잇는 나만의 루트를 짜고, 예약부터 준비물까지 한 페이지에서 끝내보세요.
          </p>
        </header>

        <TripPlanner />
        <NearbyPlaces />
        <Checklist />
        <BudgetTracker />
      </main>
    </div>
  );
}
