import { BudgetTracker } from "@/components/budget-tracker";
import { Checklist } from "@/components/checklist";
import { NearbyPlaces } from "@/components/nearby-places";
import { TripPlanner } from "@/components/trip-planner";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col items-center gap-8 px-6 py-16">
        <h1 className="text-2xl font-semibold text-foreground">이탈리아 여행 플래너</h1>
        <TripPlanner />
        <NearbyPlaces />
        <Checklist />
        <BudgetTracker />
      </main>
    </div>
  );
}
