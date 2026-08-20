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
