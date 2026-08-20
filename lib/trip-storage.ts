// 여행 플래너 입력값을 브라우저 localStorage에 저장/복원한다.
// 로그인 계정이나 서버 저장 없이, 같은 기기·브라우저에서 재방문 시 이어서
// 편집할 수 있게 하기 위함이다.
// 근거: docs/decisions/data-and-booking-strategy.md

const STORAGE_KEY = "italy-trip-planner:trip";

export type StoredTrip = {
  arrivalCityId: string;
  arrivalDateTime: string;
  departureCityId: string;
  departureDateTime: string;
  mustVisitCityIds: string[];
};

function hasLocalStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function saveTrip(trip: StoredTrip): void {
  if (!hasLocalStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
}

export function loadTrip(): StoredTrip | null {
  if (!hasLocalStorage()) return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof parsed.arrivalCityId !== "string" ||
      typeof parsed.arrivalDateTime !== "string" ||
      typeof parsed.departureCityId !== "string" ||
      typeof parsed.departureDateTime !== "string"
    ) {
      return null;
    }
    return {
      arrivalCityId: parsed.arrivalCityId,
      arrivalDateTime: parsed.arrivalDateTime,
      departureCityId: parsed.departureCityId,
      departureDateTime: parsed.departureDateTime,
      mustVisitCityIds: Array.isArray(parsed.mustVisitCityIds)
        ? parsed.mustVisitCityIds.filter((id: unknown) => typeof id === "string")
        : [],
    };
  } catch {
    return null;
  }
}

export function clearTrip(): void {
  if (!hasLocalStorage()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}
