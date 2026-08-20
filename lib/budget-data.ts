// 예산 트래커 카테고리. 실제 결제·가격 조회 연동은 없다 — 사용자가
// 직접 입력하는 메모 성격의 값만 다룬다(스펙의 제약).
export type BudgetCategory = {
  id: string;
  label: string;
};

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  { id: "transport", label: "교통(기차·항공)" },
  { id: "lodging", label: "숙소" },
  { id: "food", label: "식비" },
  { id: "activities", label: "관광·액티비티" },
  { id: "other", label: "기타" },
];
