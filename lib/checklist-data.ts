// 이탈리아 여행 준비 체크리스트 정적 항목.
// 근거: docs/decisions/data-and-booking-strategy.md, docs/specs/italy-travel-planner/spec.md의 가정
//
// ETIAS 관련 항목은 2026-08-20 기준 확인한 내용이다: 2026년 4분기 중
// 시행 예정이나 정확한 시행일은 EU가 공식 발표하지 않았다. 그래서
// "신청이 필요한지 확인"으로 문구를 두고, 여행 전 최신 공지를 다시
// 확인하도록 안내한다 — 시행일을 단정하지 않는다.
export type ChecklistItem = {
  id: string;
  label: string;
};

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "passport-validity", label: "여권 유효기간이 귀국일로부터 3개월 이상 남았는지 확인" },
  {
    id: "etias",
    label:
      "ETIAS(유럽 여행 정보 인증 시스템) 신청이 필요한지 확인 — 2026년 하반기 시행 예정이니 출발 전 최신 공지를 다시 확인",
  },
  { id: "esim", label: "현지에서 쓸 유심 또는 이심(eSIM) 준비" },
  { id: "travel-insurance", label: "여행자 보험 가입" },
  { id: "power-adapter", label: "220V, Type F/L 콘센트용 어댑터 준비" },
  { id: "booking-confirmations", label: "숙소·기차 예약 확인서 저장(인쇄 또는 화면 캡처)" },
  { id: "essentials", label: "편한 신발, 상비약, 우산/우비 등 필수 짐 챙기기" },
  { id: "intl-driving-license", label: "렌터카 계획이 있다면 국제운전면허증 준비" },
];
