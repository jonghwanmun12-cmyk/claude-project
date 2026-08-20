// 위도·경도를 정적 SVG 지도의 화면 좌표로 변환하는 유틸.
// 실시간 지도 API 없이, 큐레이션 좌표(lib/travel-data.ts)와 이탈리아 윤곽선
// (lib/italy-outline.ts)을 같은 사각 투영으로 환산해 겹쳐 그릴 수 있게 한다.
// 근거: docs/specs/italy-travel-planner/tasks/10-region-map-with-info-popup.md

export type LatLng = { lat: number; lng: number };

export type ProjectionBounds = {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
};

/**
 * 이탈리아 지도 전체(윤곽선 + 큐레이션 도시)를 아우르는 위경도 범위.
 * 윤곽선과 도시 마커가 같은 범위로 투영되어야 서로 어긋나지 않는다.
 */
export const ITALY_MAP_BOUNDS: ProjectionBounds = {
  latMin: 36.6,
  latMax: 46.9,
  lngMin: 6.8,
  lngMax: 18.7,
};

export const ITALY_MAP_VIEWBOX = { width: 360, height: 440 };

/**
 * 위경도 좌표를 SVG viewBox 좌표로 선형 투영한다. 위도가 높을수록(북쪽일수록)
 * 화면에서는 위쪽(작은 y)이 되도록 y축을 뒤집는다.
 */
export function projectLatLng(
  point: LatLng,
  bounds: ProjectionBounds = ITALY_MAP_BOUNDS,
  size: { width: number; height: number } = ITALY_MAP_VIEWBOX
): { x: number; y: number } {
  const latRange = bounds.latMax - bounds.latMin;
  const lngRange = bounds.lngMax - bounds.lngMin;
  const x = ((point.lng - bounds.lngMin) / lngRange) * size.width;
  const y = (1 - (point.lat - bounds.latMin) / latRange) * size.height;
  return { x, y };
}
