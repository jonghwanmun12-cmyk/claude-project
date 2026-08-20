import { expect, test } from "vitest";

import { NEARBY_PLACES, getDayHighlights } from "@/lib/nearby-places-data";
import { CITIES } from "@/lib/travel-data";

test("모든 큐레이션 도시는 관광지·맛집 후보를 각각 2개 이상 가진다", () => {
  for (const city of CITIES) {
    const places = NEARBY_PLACES[city.id] ?? [];
    const sights = places.filter((place) => place.category === "sight");
    const foods = places.filter((place) => place.category === "food");
    expect(sights.length, `${city.name} 관광지 후보`).toBeGreaterThanOrEqual(2);
    expect(foods.length, `${city.name} 맛집 후보`).toBeGreaterThanOrEqual(2);
  }
});

test("같은 도시에 여러 날 머물면 Day마다 다른 후보를 보여준다", () => {
  const day1 = getDayHighlights("rome", 0, 2);
  const day2 = getDayHighlights("rome", 1, 2);

  const day1Ids = new Set(day1.map((place) => place.id));
  const day2Ids = new Set(day2.map((place) => place.id));
  const overlap = [...day1Ids].filter((id) => day2Ids.has(id));

  expect(overlap).toHaveLength(0);
});

test("하루만 머물면 기존처럼 최대 5개를 보여준다", () => {
  const highlights = getDayHighlights("rome", 0, 1);
  expect(highlights.length).toBeLessThanOrEqual(5);
  expect(highlights.length).toBeGreaterThan(0);
});

test("카페가 있는 도시는 Day마다 카페를 정확히 1곳 고정으로 포함한다", () => {
  for (const day of [0, 1, 2]) {
    const highlights = getDayHighlights("rome", day, 3);
    const cafes = highlights.filter((place) => place.category === "cafe");
    expect(cafes).toHaveLength(1);
  }
});

test("왕복으로 같은 도시를 두 번 방문해도(체류 구간이 나뉘어도) 전체 기준으로 관광지·맛집 후보가 겹치지 않는다", () => {
  // 로마(Day1~2) → 다른 도시 → 로마(Day7~8)처럼 총 4일을 로마에 머무는 경우를 흉내낸다.
  // 카페는 도시당 후보가 적어(2곳) 4일이면 반복될 수 있지만, 관광지·맛집은 겹치지 않아야 한다.
  const seen = new Set<string>();
  for (let dayIndex = 0; dayIndex < 4; dayIndex++) {
    const highlights = getDayHighlights("rome", dayIndex, 4).filter((place) => place.category !== "cafe");
    for (const place of highlights) {
      expect(seen.has(place.id), `${place.id}가 이미 다른 날에 나왔음`).toBe(false);
      seen.add(place.id);
    }
  }
});
