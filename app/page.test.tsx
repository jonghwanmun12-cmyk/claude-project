import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";

import Home from "@/app/page";

beforeEach(() => {
  window.localStorage.clear();
});

test("저장된 일정이 없으면 로마 왕복 기본값이 미리 채워진다", () => {
  render(<Home />);

  expect(screen.getByLabelText("도착 도시")).toHaveValue("rome");
  expect(screen.getByLabelText("출발 도시")).toHaveValue("rome");
  expect(screen.getByLabelText("도착 일시")).toHaveValue("2027-05-23T19:00");
  expect(screen.getByLabelText("출발 일시")).toHaveValue("2027-05-30T21:00");
});

test("추천 루트가 계산되면 지도 위에 방문 순서 경로가 표시되고, 루트가 바뀌면 경로도 갱신된다", () => {
  const { container } = render(<Home />);

  // 기본값(로마 왕복, 날짜 채워짐)만으로도 이미 루트가 계산되어 경로가 보인다.
  const initialPolyline = container.querySelector("polyline");
  expect(initialPolyline).toBeInTheDocument();
  const initialPoints = initialPolyline!.getAttribute("points");

  fireEvent.change(screen.getByLabelText("출발 도시"), { target: { value: "venice" } });

  const updatedPolyline = container.querySelector("polyline");
  expect(updatedPolyline).toBeInTheDocument();
  expect(updatedPolyline!.getAttribute("points")).not.toBe(initialPoints);
});

test("도착/출발 도시와 일시를 입력하면 추천 루트가 나온다", () => {
  render(<Home />);

  expect(
    screen.getByRole("heading", { level: 1, name: "이탈리아 여행 플래너" })
  ).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText("출발 도시"), { target: { value: "venice" } });
  fireEvent.change(screen.getByLabelText("도착 일시"), {
    target: { value: "2026-09-10T14:00" },
  });
  fireEvent.change(screen.getByLabelText("출발 일시"), {
    target: { value: "2026-09-18T09:00" },
  });

  const route = screen.getByRole("region", { name: "추천 루트" });
  expect(route).toBeInTheDocument();
  expect(screen.getByText(/1\. 로마/)).toBeInTheDocument();
  expect(screen.getByText(/5\. 베네치아/)).toBeInTheDocument();
});

test("출발이 도착보다 빠르면 오류를 보여준다", () => {
  render(<Home />);

  fireEvent.change(screen.getByLabelText("도착 일시"), {
    target: { value: "2026-09-18T09:00" },
  });
  fireEvent.change(screen.getByLabelText("출발 일시"), {
    target: { value: "2026-09-10T14:00" },
  });

  expect(screen.getByRole("alert")).toHaveTextContent(
    "출발 시간은 도착 시간보다 나중이어야 합니다."
  );
});

test("입력값은 브라우저에 저장되어 다시 렌더링해도 유지된다", () => {
  const { unmount } = render(<Home />);

  fireEvent.change(screen.getByLabelText("도착 일시"), {
    target: { value: "2026-09-10T14:00" },
  });
  fireEvent.change(screen.getByLabelText("출발 일시"), {
    target: { value: "2026-09-18T09:00" },
  });
  unmount();

  render(<Home />);

  expect(screen.getByLabelText("도착 일시")).toHaveValue("2026-09-10T14:00");
  expect(screen.getByLabelText("출발 일시")).toHaveValue("2026-09-18T09:00");
});

test("꼭 가고 싶은 지역을 고르면 추천 루트가 그 지역을 포함한다", () => {
  render(<Home />);

  fireEvent.change(screen.getByLabelText("도착 일시"), {
    target: { value: "2026-09-10T14:00" },
  });
  fireEvent.change(screen.getByLabelText("출발 일시"), {
    target: { value: "2026-09-18T09:00" },
  });
  fireEvent.click(screen.getByLabelText("토리노"));

  const route = screen.getByRole("region", { name: "추천 루트" });
  expect(route).toBeInTheDocument();
  expect(screen.getByText(/\d+\. 토리노/)).toBeInTheDocument();
});

test("선택할 수 있는 지역은 최대 6곳이다", () => {
  render(<Home />);

  fireEvent.change(screen.getByLabelText("출발 도시"), { target: { value: "venice" } });

  const candidates = ["피렌체", "밀란", "나폴리", "볼로냐", "베로나", "피사", "토리노"];
  candidates.forEach((name) => fireEvent.click(screen.getByLabelText(name)));

  // 도착/출발(로마/베네치아)을 뺀 8곳 중 7곳을 눌렀지만, 6곳까지만 실제로 선택된다.
  const checked = candidates.filter(
    (name) => (screen.getByLabelText(name) as HTMLInputElement).checked
  );
  expect(checked).toHaveLength(6);
  expect(
    screen.getByText("최대 6곳까지 선택할 수 있어요. 다른 지역을 고르려면 먼저 하나를 해제하세요.")
  ).toBeInTheDocument();
});

test("구간마다 숙소·이동수단 검색 링크가 나온다", () => {
  render(<Home />);

  fireEvent.change(screen.getByLabelText("출발 도시"), { target: { value: "venice" } });
  fireEvent.change(screen.getByLabelText("도착 일시"), {
    target: { value: "2026-09-10T14:00" },
  });
  fireEvent.change(screen.getByLabelText("출발 일시"), {
    target: { value: "2026-09-18T09:00" },
  });

  // 5개 도시(로마→나폴리→피렌체→밀란→베네치아) 루트의 첫 도시(로마) 숙소 링크.
  const romeHotelLink = screen.getByRole("link", { name: /9월 10일~9월 12일 숙소 검색/ });
  expect(romeHotelLink).toHaveAttribute("target", "_blank");
  const romeHotelUrl = new URL(romeHotelLink.getAttribute("href")!);
  expect(romeHotelUrl.origin + romeHotelUrl.pathname).toBe(
    "https://www.booking.com/searchresults.html"
  );
  expect(romeHotelUrl.searchParams.get("ss")).toBe("로마");
  expect(romeHotelUrl.searchParams.get("checkin")).toBe("2026-09-10");
  expect(romeHotelUrl.searchParams.get("checkout")).toBe("2026-09-12");

  const trainLinks = screen.getAllByRole("link", { name: "Trenitalia에서 열차 검색" });
  expect(trainLinks.length).toBeGreaterThan(0);
  trainLinks.forEach((link) => {
    expect(link).toHaveAttribute("href", "https://www.trenitalia.com");
    expect(link).toHaveAttribute("target", "_blank");
  });
});

test("일자별 일정이 도착일부터 출발일까지 표시된다", () => {
  render(<Home />);

  fireEvent.change(screen.getByLabelText("도착 일시"), {
    target: { value: "2026-09-10T14:00" },
  });
  fireEvent.change(screen.getByLabelText("출발 일시"), {
    target: { value: "2026-09-18T09:00" },
  });

  const dayPlan = screen.getByRole("region", { name: "일자별 일정" });
  expect(dayPlan).toBeInTheDocument();
  expect(screen.getByText("Day 1")).toBeInTheDocument();
  // 8박 + 출발일 = 9일치.
  expect(screen.getByText("Day 9")).toBeInTheDocument();
  expect(screen.queryByText("Day 10")).not.toBeInTheDocument();
});

test("Day 카드에 그 도시의 관광지·맛집 후보와 이미지가 최대 5개까지 표시된다", () => {
  render(<Home />);

  fireEvent.change(screen.getByLabelText("도착 일시"), {
    target: { value: "2026-09-10T14:00" },
  });
  fireEvent.change(screen.getByLabelText("출발 일시"), {
    target: { value: "2026-09-18T09:00" },
  });

  const dayPlan = screen.getByRole("region", { name: "일자별 일정" });
  const day1 = within(dayPlan).getByText("Day 1").closest("li")!;

  const images = within(day1).getAllByRole("img");
  expect(images.length).toBeGreaterThanOrEqual(2);
  expect(images.length).toBeLessThanOrEqual(5);

  const mapLinks = within(day1).getAllByRole("link", { name: "구글맵에서 보기" });
  expect(mapLinks.length).toBe(images.length);
});

test("캘린더 내보내기를 누르면 화면 일정과 같은 날짜·도시의 .ics 파일을 만든다", () => {
  render(<Home />);

  fireEvent.change(screen.getByLabelText("도착 일시"), {
    target: { value: "2026-09-10T14:00" },
  });
  fireEvent.change(screen.getByLabelText("출발 일시"), {
    target: { value: "2026-09-18T09:00" },
  });

  const blobs: Blob[] = [];
  const createObjectURL = vi
    .spyOn(URL, "createObjectURL")
    .mockImplementation((blob) => {
      blobs.push(blob as Blob);
      return "blob:mock-ics";
    });
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

  fireEvent.click(screen.getByRole("button", { name: "캘린더 내보내기 (.ics)" }));

  expect(blobs).toHaveLength(1);
  expect(blobs[0].type).toBe("text/calendar;charset=utf-8");
  return blobs[0].text().then((text) => {
    expect(text).toContain("BEGIN:VCALENDAR");
    expect(text).toContain("DTSTART;VALUE=DATE:20260910");
    expect(text).toContain("SUMMARY:Day 1: 로마");
    createObjectURL.mockRestore();
  });
});

test("PDF 내보내기를 누르면 화면 일정과 같은 날짜·도시가 담긴 PDF 파일을 만든다", () => {
  render(<Home />);

  fireEvent.change(screen.getByLabelText("도착 일시"), {
    target: { value: "2026-09-10T14:00" },
  });
  fireEvent.change(screen.getByLabelText("출발 일시"), {
    target: { value: "2026-09-18T09:00" },
  });

  const blobs: Blob[] = [];
  vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
    blobs.push(blob as Blob);
    return "blob:mock-pdf";
  });
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

  fireEvent.click(screen.getByRole("button", { name: "PDF 내보내기" }));

  expect(blobs).toHaveLength(1);
  expect(blobs[0].type).toBe("application/pdf");
  expect(blobs[0].size).toBeGreaterThan(0);
});

test("체크리스트 항목을 체크하면 재렌더링해도 유지된다", () => {
  const { unmount } = render(<Home />);

  const checklist = screen.getByRole("region", { name: "여행 준비 체크리스트" });
  expect(checklist).toBeInTheDocument();

  const passportItem = screen.getByLabelText(/여권 유효기간/);
  expect(passportItem).not.toBeChecked();
  fireEvent.click(passportItem);
  expect(passportItem).toBeChecked();

  unmount();
  render(<Home />);

  expect(screen.getByLabelText(/여권 유효기간/)).toBeChecked();
  // 체크하지 않은 항목은 그대로 해제 상태여야 한다.
  expect(screen.getByLabelText(/여행자 보험/)).not.toBeChecked();
});

test("위치 권한을 허용하고 GPS가 큐레이션 도시와 가까우면 그 도시의 맛집·관광지가 보인다", () => {
  vi.stubGlobal("navigator", {
    ...navigator,
    geolocation: {
      getCurrentPosition: (success: PositionCallback) => {
        success({
          coords: { latitude: 45.4642, longitude: 9.19 }, // 밀란 좌표
        } as GeolocationPosition);
      },
    },
  });

  render(<Home />);

  const nearby = screen.getByRole("region", { name: "내 위치 주변 정보" });
  expect(nearby).toBeInTheDocument();
  expect(within(nearby).getByText("밀라노 두오모")).toBeInTheDocument();
  expect(screen.getByLabelText("도시 선택")).toHaveValue("milan");

  // 관광지·맛집 각각 여러 후보가 있고, 구글맵 링크 버튼이 붙어 있다.
  const mapLinks = within(nearby).getAllByRole("link", { name: "구글맵에서 보기" });
  expect(mapLinks.length).toBeGreaterThanOrEqual(4);
  const firstMapUrl = new URL(mapLinks[0].getAttribute("href")!);
  expect(firstMapUrl.origin + firstMapUrl.pathname).toBe("https://www.google.com/maps/search/");
  expect(mapLinks[0]).toHaveAttribute("target", "_blank");
  expect(within(nearby).getAllByRole("heading", { level: 3, name: "관광지 후보" })).toHaveLength(1);
  expect(within(nearby).getAllByRole("heading", { level: 3, name: "맛집 후보" })).toHaveLength(1);

  vi.unstubAllGlobals();
});

test("GPS가 이탈리아 큐레이션 도시들과 멀면 도착 도시 기준으로 목록이 보인다", () => {
  vi.stubGlobal("navigator", {
    ...navigator,
    geolocation: {
      getCurrentPosition: (success: PositionCallback) => {
        success({
          coords: { latitude: 37.5665, longitude: 126.978 }, // 서울 좌표
        } as GeolocationPosition);
      },
    },
  });

  render(<Home />);

  // 도착 도시 기본값(로마) 기준으로 표시된다.
  const nearby = screen.getByRole("region", { name: "내 위치 주변 정보" });
  expect(within(nearby).getByText("콜로세움")).toBeInTheDocument();
  expect(screen.getByLabelText("도시 선택")).toHaveValue("rome");
  expect(
    screen.getByText("현재 위치가 큐레이션 도시들과 멀리 떨어져 있어, 도착 도시 기준으로 보여줍니다.")
  ).toBeInTheDocument();

  vi.unstubAllGlobals();
});

test("위치 권한을 거부해도 도시를 직접 선택해 맛집·관광지 목록을 볼 수 있다", () => {
  vi.stubGlobal("navigator", {
    ...navigator,
    geolocation: {
      getCurrentPosition: (_success: PositionCallback, error: PositionErrorCallback) => {
        error({ code: 1, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 } as GeolocationPositionError);
      },
    },
  });

  render(<Home />);

  expect(
    screen.getByText("위치 권한이 거부되어, 도시를 직접 선택해 볼 수 있습니다.")
  ).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText("도시 선택"), { target: { value: "venice" } });
  const nearby = screen.getByRole("region", { name: "내 위치 주변 정보" });
  expect(within(nearby).getByText("산 마르코 광장")).toBeInTheDocument();

  vi.unstubAllGlobals();
});

test("맛집·관광지 이미지가 깨지면 항목은 남고 대체 표시가 나온다", () => {
  render(<Home />); // navigator.geolocation 없음 → 미지원으로 폴백, 로마 기준 표시

  const nearby = screen.getByRole("region", { name: "내 위치 주변 정보" });
  const colosseumImage = within(nearby).getByAltText("콜로세움");
  fireEvent.error(colosseumImage);

  expect(within(nearby).getByText("콜로세움")).toBeInTheDocument();
  expect(within(nearby).getByLabelText("콜로세움 이미지 없음")).toBeInTheDocument();
});

test("예산 트래커에 금액을 입력하면 합계가 즉시 갱신되고 재렌더링해도 유지된다", () => {
  const { unmount } = render(<Home />);

  const budget = screen.getByRole("region", { name: "예산 트래커" });
  expect(budget).toBeInTheDocument();
  expect(screen.getByText("합계: 0원")).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText("교통(기차·항공)"), { target: { value: "300000" } });
  fireEvent.change(screen.getByLabelText("숙소"), { target: { value: "800000" } });

  expect(screen.getByText("합계: 1,100,000원")).toBeInTheDocument();

  unmount();
  render(<Home />);

  expect(screen.getByLabelText("교통(기차·항공)")).toHaveValue(300000);
  expect(screen.getByLabelText("숙소")).toHaveValue(800000);
  expect(screen.getByText("합계: 1,100,000원")).toBeInTheDocument();
});

test("공유 링크 만들기를 누르면 현재 입력값이 담긴 URL이 나온다", () => {
  render(<Home />);

  fireEvent.change(screen.getByLabelText("출발 도시"), { target: { value: "venice" } });
  fireEvent.change(screen.getByLabelText("도착 일시"), {
    target: { value: "2026-09-10T14:00" },
  });
  fireEvent.change(screen.getByLabelText("출발 일시"), {
    target: { value: "2026-09-18T09:00" },
  });
  fireEvent.click(screen.getByLabelText("토리노"));

  fireEvent.click(screen.getByRole("button", { name: "공유 링크 만들기" }));

  const shareInput = screen.getByLabelText("공유 링크") as HTMLInputElement;
  const url = new URL(shareInput.value);

  expect(url.searchParams.get("arrival")).toBe("rome");
  expect(url.searchParams.get("arrivalAt")).toBe("2026-09-10T14:00");
  expect(url.searchParams.get("departure")).toBe("venice");
  expect(url.searchParams.get("departureAt")).toBe("2026-09-18T09:00");
  expect(url.searchParams.get("mustVisit")).toBe("turin");
});

test("공유 링크로 열면 로그인/저장된 값 없이도 같은 루트와 일자별 일정이 보인다", () => {
  window.history.pushState(
    {},
    "",
    "/?arrival=rome&arrivalAt=2026-09-10T14:00&departure=venice&departureAt=2026-09-18T09:00&mustVisit=turin"
  );

  try {
    render(<Home />);

    expect(screen.getByLabelText("도착 일시")).toHaveValue("2026-09-10T14:00");
    expect(screen.getByLabelText("출발 일시")).toHaveValue("2026-09-18T09:00");
    expect(screen.getByRole("region", { name: "추천 루트" })).toBeInTheDocument();
    expect(screen.getByText(/\d+\. 토리노/)).toBeInTheDocument();

    const dayPlan = screen.getByRole("region", { name: "일자별 일정" });
    expect(dayPlan).toBeInTheDocument();
    expect(screen.getByText("Day 1")).toBeInTheDocument();
  } finally {
    window.history.pushState({}, "", "/");
  }
});
