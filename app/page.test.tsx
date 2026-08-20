import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";

import Home from "@/app/page";

beforeEach(() => {
  window.localStorage.clear();
});

test("도착/출발 도시와 일시를 입력하면 추천 루트가 나온다", () => {
  render(<Home />);

  expect(
    screen.getByRole("heading", { level: 1, name: "이탈리아 여행 플래너" })
  ).toBeInTheDocument();

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
