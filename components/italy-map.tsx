"use client";

import { useState } from "react";

import { getCityHighlight } from "@/lib/city-highlights-data";
import { ITALY_MAINLAND_OUTLINE, SICILY_OUTLINE, type LngLat } from "@/lib/italy-outline";
import { ITALY_MAP_VIEWBOX, projectLatLng } from "@/lib/geo-projection";
import { CITIES, getCity } from "@/lib/travel-data";

const { width: VIEW_W, height: VIEW_H } = ITALY_MAP_VIEWBOX;

function outlineToPath(points: LngLat[]): string {
  return (
    points
      .map(([lng, lat], index) => {
        const { x, y } = projectLatLng({ lat, lng });
        return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ") + " Z"
  );
}

const MAINLAND_PATH = outlineToPath(ITALY_MAINLAND_OUTLINE);
const SICILY_PATH = outlineToPath(SICILY_OUTLINE);

export type ItalyMapProps = {
  /** "꼭 가고 싶은 지역"으로 선택된 도시 id 목록. */
  selectedCityIds: string[];
  /** 선택 가능한 마커를 클릭했을 때 선택 상태를 토글한다. */
  onToggleCity: (cityId: string) => void;
  /** 도착/출발 도시처럼 이미 루트 양 끝에 고정된 도시 id — 정보 팝업은 뜨지만 선택 토글은 되지 않는다. */
  fixedCityIds?: string[];
  /** 추천 루트 방문 순서(도착 → 경유 → 출발). 있으면 지도 위에 경로로 겹쳐 그린다. */
  routeCityIds?: string[];
};

export function ItalyMap({ selectedCityIds, onToggleCity, fixedCityIds = [], routeCityIds }: ItalyMapProps) {
  const [activeCityId, setActiveCityId] = useState<string | null>(null);
  const [brokenImageKeys, setBrokenImageKeys] = useState<Set<string>>(new Set());

  const activeHighlight = activeCityId ? getCityHighlight(activeCityId) : undefined;
  const activeCity = activeCityId ? getCity(activeCityId) : undefined;

  function markBroken(key: string) {
    setBrokenImageKeys((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }

  function handleMarkerActivate(cityId: string) {
    setActiveCityId(cityId);
    if (!fixedCityIds.includes(cityId)) {
      onToggleCity(cityId);
    }
  }

  const routePoints =
    routeCityIds && routeCityIds.length > 1
      ? routeCityIds
          .map((cityId) => getCity(cityId))
          .filter((city): city is NonNullable<typeof city> => Boolean(city))
          .map((city) => projectLatLng({ lat: city.lat, lng: city.lng }))
      : null;

  return (
    <div className="flex flex-col gap-3">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-label="이탈리아 지도, 큐레이션 도시 표시"
        className="h-auto w-full max-w-xs self-center rounded-lg bg-sky-50 dark:bg-slate-900"
      >
        <path d={MAINLAND_PATH} className="fill-emerald-100 stroke-emerald-400 dark:fill-emerald-950 dark:stroke-emerald-700" strokeWidth={1.5} />
        <path d={SICILY_PATH} className="fill-emerald-100 stroke-emerald-400 dark:fill-emerald-950 dark:stroke-emerald-700" strokeWidth={1.5} />

        {routePoints && (
          <polyline
            points={routePoints.map((point) => `${point.x},${point.y}`).join(" ")}
            fill="none"
            className="stroke-primary"
            strokeWidth={2.5}
            strokeDasharray="6 4"
            strokeLinecap="round"
          />
        )}

        {routePoints &&
          routePoints.map((point, index) => (
            <g key={`route-order-${index}`} className="pointer-events-none">
              <circle cx={point.x + 9} cy={point.y - 9} r={6} className="fill-primary stroke-white dark:stroke-slate-900" strokeWidth={1} />
              <text
                x={point.x + 9}
                y={point.y - 9}
                dy="0.32em"
                textAnchor="middle"
                className="fill-primary-foreground text-[7px] font-semibold"
              >
                {index + 1}
              </text>
            </g>
          ))}

        {CITIES.map((city) => {
          const { x, y } = projectLatLng({ lat: city.lat, lng: city.lng });
          const selected = selectedCityIds.includes(city.id);
          const fixed = fixedCityIds.includes(city.id);
          const active = activeCityId === city.id;
          return (
            <g
              key={city.id}
              role="button"
              tabIndex={0}
              aria-label={`${city.name} 지도 마커`}
              aria-pressed={fixed ? undefined : selected}
              onClick={() => handleMarkerActivate(city.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleMarkerActivate(city.id);
                }
              }}
              className="cursor-pointer outline-none"
            >
              <circle
                cx={x}
                cy={y}
                r={active ? 8 : 6}
                className={
                  fixed
                    ? "fill-amber-500 stroke-white dark:stroke-slate-900"
                    : selected
                      ? "fill-primary stroke-white dark:stroke-slate-900"
                      : "fill-slate-500 stroke-white dark:stroke-slate-900"
                }
                strokeWidth={1.5}
              />
              <text x={x} y={y - 10} textAnchor="middle" className="fill-foreground text-[8px] font-medium">
                {city.name}
              </text>
            </g>
          );
        })}
      </svg>

      {activeCity && (
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground">{activeCity.name}</h3>
            <button
              type="button"
              aria-label="지역 정보 팝업 닫기"
              className="text-xs text-muted-foreground underline underline-offset-2"
              onClick={() => setActiveCityId(null)}
            >
              닫기
            </button>
          </div>
          {activeHighlight ? (
            <>
              <p className="text-sm text-muted-foreground">{activeHighlight.description}</p>
              <div className="flex gap-2 overflow-x-auto">
                {activeHighlight.imageUrls.map((url, index) => {
                  const key = `${activeCity.id}:${index}`;
                  const broken = brokenImageKeys.has(key);
                  return broken ? (
                    <div
                      key={key}
                      role="img"
                      aria-label={`${activeCity.name} 이미지 없음`}
                      className="flex h-20 w-28 flex-none items-center justify-center rounded-md bg-muted text-[10px] text-muted-foreground"
                    >
                      이미지를 불러올 수 없습니다
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element -- 외부 Wikimedia Commons 이미지.
                    <img
                      key={key}
                      src={url}
                      alt={activeCity.name}
                      className="h-20 w-28 flex-none rounded-md object-cover"
                      onError={() => markBroken(key)}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">준비된 소개가 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}
