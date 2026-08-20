import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import { ItalyMap } from "@/components/italy-map";

test("큐레이션 도시만 마커로 나오고, 클릭하면 팝업이 뜨며 선택이 토글된다", () => {
  const onToggleCity = vi.fn();
  render(<ItalyMap selectedCityIds={[]} onToggleCity={onToggleCity} />);

  // 큐레이션 도시(10곳)만 마커로 존재해야 한다.
  expect(screen.getByRole("button", { name: "피렌체 지도 마커" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "밀라노 지도 마커" })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "피렌체 지도 마커" }));

  expect(onToggleCity).toHaveBeenCalledWith("florence");
  expect(screen.getByText(/르네상스 예술의 중심지/)).toBeInTheDocument();
  expect(screen.getAllByAltText("피렌체").length).toBeGreaterThanOrEqual(2);
});

test("고정 도시(도착/출발) 마커를 클릭하면 팝업만 뜨고 선택은 토글되지 않는다", () => {
  const onToggleCity = vi.fn();
  render(<ItalyMap selectedCityIds={[]} onToggleCity={onToggleCity} fixedCityIds={["rome"]} />);

  fireEvent.click(screen.getByRole("button", { name: "로마 지도 마커" }));

  expect(onToggleCity).not.toHaveBeenCalled();
  expect(screen.getByText(/고대 로마 유적/)).toBeInTheDocument();
});

test("routeCityIds가 있으면 방문 순서대로 이어진 경로와 순번이 표시된다", () => {
  const { container, rerender } = render(
    <ItalyMap selectedCityIds={[]} onToggleCity={() => {}} />
  );
  expect(container.querySelector("polyline")).not.toBeInTheDocument();

  rerender(
    <ItalyMap
      selectedCityIds={["florence"]}
      onToggleCity={() => {}}
      fixedCityIds={["rome", "venice"]}
      routeCityIds={["rome", "florence", "venice"]}
    />
  );

  const polyline = container.querySelector("polyline");
  expect(polyline).toBeInTheDocument();
  expect(polyline!.getAttribute("points")?.split(" ")).toHaveLength(3);
  expect(screen.getByText("1")).toBeInTheDocument();
  expect(screen.getByText("2")).toBeInTheDocument();
  expect(screen.getByText("3")).toBeInTheDocument();
});

test("팝업 이미지가 깨지면 그 자리에만 대체 표시가 나온다", () => {
  render(<ItalyMap selectedCityIds={[]} onToggleCity={() => {}} />);

  fireEvent.click(screen.getByRole("button", { name: "로마 지도 마커" }));
  const images = screen.getAllByAltText("로마");
  fireEvent.error(images[0]);

  expect(screen.getByLabelText("로마 이미지 없음")).toBeInTheDocument();
  expect(screen.getAllByAltText("로마").length).toBeGreaterThanOrEqual(1);
});
