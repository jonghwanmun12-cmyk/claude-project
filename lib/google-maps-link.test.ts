import { expect, test } from "vitest";

import { buildGoogleMapsSearchUrl } from "@/lib/google-maps-link";

test("장소명과 도시명을 쿼리로 채운 구글맵 검색 URL을 만든다", () => {
  const url = new URL(buildGoogleMapsSearchUrl("콜로세움", "로마"));
  expect(url.origin + url.pathname).toBe("https://www.google.com/maps/search/");
  expect(url.searchParams.get("api")).toBe("1");
  expect(url.searchParams.get("query")).toBe("콜로세움 로마");
});
