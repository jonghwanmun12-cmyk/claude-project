import { describe, expect, it } from "vitest";

import { findNearestCity, haversineDistanceKm, resolveNearbyCityId } from "@/lib/nearest-city";
import { getCity } from "@/lib/travel-data";

describe("haversineDistanceKm", () => {
  it("같은 좌표는 거리 0을 준다", () => {
    expect(haversineDistanceKm({ lat: 41.9, lng: 12.5 }, { lat: 41.9, lng: 12.5 })).toBe(0);
  });

  it("로마-피렌체 대략 거리(약 230km)를 준다", () => {
    const rome = getCity("rome")!;
    const florence = getCity("florence")!;
    const distance = haversineDistanceKm(rome, florence);
    expect(distance).toBeGreaterThan(200);
    expect(distance).toBeLessThan(260);
  });
});

describe("findNearestCity / resolveNearbyCityId", () => {
  it("큐레이션 도시 좌표 그대로 넣으면 그 도시가 최근접으로 나온다", () => {
    const milan = getCity("milan")!;
    expect(findNearestCity(milan).cityId).toBe("milan");
    expect(resolveNearbyCityId(milan)).toBe("milan");
  });

  it("이탈리아 밖(서울) 좌표는 근접 도시가 없다고 판단한다", () => {
    const seoul = { lat: 37.5665, lng: 126.978 };
    expect(resolveNearbyCityId(seoul)).toBeNull();
  });
});
