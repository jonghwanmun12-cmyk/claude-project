import { CITIES, getTravelHours, isCuratedCity } from "@/lib/travel-data";

export type RouteLeg = {
  from: string;
  to: string;
  hours: number;
};

export type RoutePlan = {
  cityIds: string[];
  legs: RouteLeg[];
  totalHours: number;
};

/** 도착/출발 시각으로부터 체류 일수(밤 수)를 계산한다. 최소 1로 clamp. */
export function computeNights(arrivalIso: string, departureIso: string): number {
  const arrival = new Date(arrivalIso).getTime();
  const departure = new Date(departureIso).getTime();
  const diffDays = (departure - arrival) / (1000 * 60 * 60 * 24);
  return Math.max(1, Math.round(diffDays));
}

function pickTopPriorityCities(excludeIds: Set<string>, count: number): string[] {
  return CITIES.filter((city) => !excludeIds.has(city.id))
    .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id))
    .slice(0, Math.max(0, count))
    .map((city) => city.id);
}

function permutations<T>(items: T[]): T[][] {
  if (items.length <= 1) return [items];
  const result: T[][] = [];
  items.forEach((item, index) => {
    const rest = [...items.slice(0, index), ...items.slice(index + 1)];
    for (const perm of permutations(rest)) {
      result.push([item, ...perm]);
    }
  });
  return result;
}

function routeHours(cityIds: string[]): number {
  let total = 0;
  for (let i = 0; i < cityIds.length - 1; i++) {
    const hours = getTravelHours(cityIds[i], cityIds[i + 1]);
    if (hours === undefined) return Infinity;
    total += hours;
  }
  return total;
}

/**
 * 순열 탐색으로 경유 도시 수를 제한한다. 6곳까지는 6! = 720가지라 즉시 계산 가능하다.
 * "꼭 가고 싶은 지역" 선택 UI도 이 값을 그대로 써서, 선택 단계에서부터 6개를
 * 넘기지 못하게 막는다(넘기면 이 아래에서 조용히 잘리므로).
 */
export const MAX_VIA_CITIES = 6;

export type ComputeRouteInput = {
  arrivalCityId: string;
  departureCityId: string;
  /** 체류 일수(밤 수). 경유 도시 개수를 정하는 데 쓴다. */
  nights: number;
  /** 꼭 가고 싶은 지역(큐레이션 도시 id). 지정하면 대표성 기준 선택 대신 이 목록을 모두 포함한다. */
  mustVisitCityIds?: string[];
};

export function computeRoute({
  arrivalCityId,
  departureCityId,
  nights,
  mustVisitCityIds = [],
}: ComputeRouteInput): RoutePlan {
  if (!isCuratedCity(arrivalCityId)) {
    throw new Error(`큐레이션 목록에 없는 도착 도시입니다: ${arrivalCityId}`);
  }
  if (!isCuratedCity(departureCityId)) {
    throw new Error(`큐레이션 목록에 없는 출발 도시입니다: ${departureCityId}`);
  }
  for (const id of mustVisitCityIds) {
    if (!isCuratedCity(id)) {
      throw new Error(`큐레이션 목록에 없는 지역입니다: ${id}`);
    }
  }

  const fixed = new Set([arrivalCityId, departureCityId]);
  const forcedVia = Array.from(new Set(mustVisitCityIds.filter((id) => !fixed.has(id))));

  let viaCityIds: string[];
  if (forcedVia.length > 0) {
    viaCityIds = forcedVia.slice(0, MAX_VIA_CITIES);
  } else if (arrivalCityId === departureCityId && nights <= 1) {
    viaCityIds = [];
  } else {
    const slots = arrivalCityId === departureCityId ? 1 : 2;
    const desiredStops = Math.round(nights / 2);
    const availableCandidates = CITIES.length - fixed.size;
    const maxVia = Math.min(MAX_VIA_CITIES, availableCandidates);
    const viaCount = Math.max(0, Math.min(maxVia, desiredStops - slots + 1));
    viaCityIds = pickTopPriorityCities(fixed, viaCount);
  }

  if (viaCityIds.length === 0 && arrivalCityId === departureCityId) {
    return { cityIds: [arrivalCityId], legs: [], totalHours: 0 };
  }

  // 경유 도시는 반드시 모두 포함해야 하므로, "생략할지"가 아니라 "어떤 순서로
  // 방문할지"만 비교한다. viaCityIds가 비어 있으면 permutations가 [[]] 하나만
  // 돌려주므로 도착->출발 직행 루트가 그대로 선택된다.
  let bestRoute: string[] | null = null;
  let bestHours = Infinity;

  for (const perm of permutations(viaCityIds)) {
    const candidate = [arrivalCityId, ...perm, departureCityId];
    const hours = routeHours(candidate);
    if (hours < bestHours) {
      bestHours = hours;
      bestRoute = candidate;
    }
  }

  if (!bestRoute) {
    bestRoute = [arrivalCityId, departureCityId];
    bestHours = routeHours(bestRoute);
  }

  const legs: RouteLeg[] = [];
  for (let i = 0; i < bestRoute.length - 1; i++) {
    legs.push({
      from: bestRoute[i],
      to: bestRoute[i + 1],
      hours: getTravelHours(bestRoute[i], bestRoute[i + 1]) ?? 0,
    });
  }

  return {
    cityIds: bestRoute,
    legs,
    totalHours: legs.reduce((sum, leg) => sum + leg.hours, 0),
  };
}
