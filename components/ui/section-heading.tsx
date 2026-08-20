import type { LucideIcon } from "lucide-react";

/**
 * 화면 곳곳의 섹션 제목(여행 플래너, 주변 정보, 체크리스트, 예산 트래커 등)이
 * 같은 아이콘 배지 + 제목 + 부제 구조를 공유하도록 만든 공통 헤더.
 * 근거: docs/specs/italy-travel-planner/tasks/14-visual-design-refresh.md
 */
export function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
