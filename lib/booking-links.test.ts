import { describe, expect, it } from "vitest";

import { buildHotelSearchUrl, TRAIN_BOOKING_HOMEPAGE_URL } from "@/lib/booking-links";

describe("buildHotelSearchUrl", () => {
  it("도시명과 checkin/checkout이 Booking.com이 실제로 쓰는 쿼리 파라미터로 들어간다", () => {
    const url = new URL(buildHotelSearchUrl("피렌체", "2026-09-12", "2026-09-14"));

    expect(url.origin + url.pathname).toBe("https://www.booking.com/searchresults.html");
    expect(url.searchParams.get("ss")).toBe("피렌체");
    expect(url.searchParams.get("checkin")).toBe("2026-09-12");
    expect(url.searchParams.get("checkout")).toBe("2026-09-14");
  });
});

describe("TRAIN_BOOKING_HOMEPAGE_URL", () => {
  it("Trenitalia 홈페이지를 가리킨다", () => {
    expect(TRAIN_BOOKING_HOMEPAGE_URL).toBe("https://www.trenitalia.com");
  });
});
