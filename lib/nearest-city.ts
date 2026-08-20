// GPS 좌표를 큐레이션 도시 중 가장 가까운 곳과 매칭한다.
// 근거: docs/decisions/data-and-booking-strategy.md, docs/specs/italy-travel-planner/tasks/05-nearby-places.md

import { CITIES } from "@/lib/travel-data";

/**
 * 이 거리(km)보다 가까운 큐레이션 도시가 있어야 "근처"로 인정한다. 이보다
 * 멀면(예: 여행 전 한국에서 접속) GPS 근접 도시 대신 도착 도시로 폴백한다.
 * 이탈리아 큐레이션 도시들끼리 가장 먼 쌍도 이 값보다 훨씬 가까우므로, 이
 * 값을 넘는다는 것은 사실상 이탈리아 밖에 있다는 뜻이다.
 */
export const NEARBY_THRESHOLD_KM = 150;

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** 두 좌표 사이의 대권 거리(km). Haversine 공식. */
export function haversineDistanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat + Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * sinDLng * sinDLng;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export type NearestCityResult = {
  cityId: string;
  distanceKm: number;
};

/** 큐레이션 도시 중 좌표와 가장 가까운 도시와 그 거리(km)를 찾는다. */
export function findNearestCity(coords: { lat: number; lng: number }): NearestCityResult {
  let nearest = CITIES[0];
  let nearestDistance = haversineDistanceKm(coords, nearest);
  for (const city of CITIES.slice(1)) {
    const distance = haversineDistanceKm(coords, city);
    if (distance < nearestDistance) {
      nearest = city;
      nearestDistance = distance;
    }
  }
  return { cityId: nearest.id, distanceKm: nearestDistance };
}

/**
 * GPS 좌표로 표시할 도시를 정한다. 가장 가까운 큐레이션 도시가
 * {@link NEARBY_THRESHOLD_KM} 안에 있으면 그 도시를, 아니면 null을 준다
 * (호출 쪽에서 도착 도시 등으로 폴백해야 한다는 신호).
 */
export function resolveNearbyCityId(coords: { lat: number; lng: number }): string | null {
  const nearest = findNearestCity(coords);
  return nearest.distanceKm <= NEARBY_THRESHOLD_KM ? nearest.cityId : null;
}
