import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, test } from "vitest";

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
