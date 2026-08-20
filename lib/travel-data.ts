// 이탈리아 여행 플래너용 큐레이션 정적 데이터.
// 외부 지도/경로 API를 호출하지 않고, 주요 도시 10곳과 도시 쌍별 기차 이동
// 시간(대략치, 시간 단위)만 직접 관리한다.
// 근거: docs/decisions/data-and-booking-strategy.md

export type City = {
  id: string;
  name: string;
  /** 대표성(주요도) 점수. 높을수록 필수 방문 지역 없이 루트를 짤 때 먼저 포함된다. */
  priority: number;
};

export const CITIES: City[] = [
  { id: "rome", name: "로마", priority: 5 },
  { id: "florence", name: "피렌체", priority: 5 },
  { id: "venice", name: "베네치아", priority: 5 },
  { id: "milan", name: "밀란", priority: 4 },
  { id: "naples", name: "나폴리", priority: 4 },
  { id: "bologna", name: "볼로냐", priority: 3 },
  { id: "verona", name: "베로나", priority: 3 },
  { id: "pisa", name: "피사", priority: 3 },
  { id: "turin", name: "토리노", priority: 2 },
  { id: "genoa", name: "제노바", priority: 2 },
];

const CITY_BY_ID = new Map(CITIES.map((city) => [city.id, city]));

export function isCuratedCity(cityId: string): boolean {
  return CITY_BY_ID.has(cityId);
}

export function getCity(cityId: string): City | undefined {
  return CITY_BY_ID.get(cityId);
}

function pairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/**
 * 도시 쌍별 기차 이동 시간(시간 단위) 원본 데이터. 큐레이션 값으로, 실제
 * 시간표와는 다를 수 있다. 각 쌍은 한 번만 적으면 되고, 순서는 신경 쓰지
 * 않아도 된다 — 조회용 맵은 아래에서 pairKey로 정규화해서 만든다.
 */
const TRAVEL_HOURS_ENTRIES: Array<[string, string, number]> = [
  ["rome", "florence", 1.5],
  ["rome", "venice", 3.5],
  ["rome", "milan", 3],
  ["rome", "naples", 1.2],
  ["rome", "bologna", 2],
  ["rome", "turin", 4.5],
  ["rome", "genoa", 5],
  ["rome", "verona", 4],
  ["rome", "pisa", 3],
  ["florence", "venice", 2],
  ["florence", "milan", 1.75],
  ["florence", "naples", 3],
  ["florence", "bologna", 0.6],
  ["florence", "turin", 3],
  ["florence", "genoa", 2],
  ["florence", "verona", 2],
  ["florence", "pisa", 1],
  ["venice", "milan", 2.5],
  ["venice", "naples", 5],
  ["venice", "bologna", 1.5],
  ["venice", "turin", 4],
  ["venice", "genoa", 4],
  ["venice", "verona", 1.2],
  ["venice", "pisa", 3.5],
  ["milan", "naples", 4.5],
  ["milan", "bologna", 1],
  ["milan", "turin", 1],
  ["milan", "genoa", 1.5],
  ["milan", "verona", 1.3],
  ["milan", "pisa", 3],
  ["naples", "bologna", 3],
  ["naples", "turin", 6],
  ["naples", "genoa", 5],
  ["naples", "verona", 5.5],
  ["naples", "pisa", 4.5],
  ["bologna", "turin", 2],
  ["bologna", "genoa", 2],
  ["bologna", "verona", 1],
  ["bologna", "pisa", 1.75],
  ["turin", "genoa", 1.5],
  ["turin", "verona", 3],
  ["turin", "pisa", 3],
  ["genoa", "verona", 3],
  ["genoa", "pisa", 1.3],
  ["verona", "pisa", 2.5],
];

const TRAVEL_HOURS: Record<string, number> = Object.fromEntries(
  TRAVEL_HOURS_ENTRIES.map(([a, b, hours]) => [pairKey(a, b), hours])
);

/** 두 큐레이션 도시 사이의 기차 이동 시간(시간). 같은 도시면 0, 데이터가 없으면 undefined. */
export function getTravelHours(cityIdA: string, cityIdB: string): number | undefined {
  if (cityIdA === cityIdB) return 0;
  return TRAVEL_HOURS[pairKey(cityIdA, cityIdB)];
}
