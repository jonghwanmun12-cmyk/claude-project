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
