"use client";

import { useEffect, useState } from "react";

import { getNearbyPlaces } from "@/lib/nearby-places-data";
import { resolveNearbyCityId } from "@/lib/nearest-city";
import { CITIES } from "@/lib/travel-data";
import { loadTrip } from "@/lib/trip-storage";

type GeoStatus =
  | "loading"
  | "granted-nearby"
  | "granted-far"
  | "denied"
  | "unsupported"
  | "error";

const STATUS_MESSAGE: Record<GeoStatus, string> = {
  loading: "현재 위치를 확인하는 중...",
  "granted-nearby": "현재 위치와 가장 가까운 큐레이션 도시를 보여줍니다.",
  "granted-far": "현재 위치가 큐레이션 도시들과 멀리 떨어져 있어, 도착 도시 기준으로 보여줍니다.",
  denied: "위치 권한이 거부되어, 도시를 직접 선택해 볼 수 있습니다.",
  unsupported: "이 브라우저는 위치 정보를 지원하지 않아, 도시를 직접 선택해 볼 수 있습니다.",
  error: "위치를 확인하지 못해, 도시를 직접 선택해 볼 수 있습니다.",
};

/** 저장된 일정의 도착 도시, 없으면 첫 큐레이션 도시로 폴백한다. */
function fallbackCityId(): string {
  return loadTrip()?.arrivalCityId ?? CITIES[0].id;
}

export function NearbyPlaces() {
  const [status, setStatus] = useState<GeoStatus>("loading");
  const [cityId, setCityId] = useState<string | null>(null);
  const [brokenImageIds, setBrokenImageIds] = useState<Set<string>>(new Set());

  // 서버에는 위치 정보/localStorage가 없어 마운트 이후에만 조회한다
  // (components/trip-planner.tsx와 같은 하이드레이션 회피 패턴).
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      // 브라우저 API(navigator.geolocation) 유무는 마운트 이후에만 알 수
      // 있어, 다른 컴포넌트와 같은 이유로 이 effect 안에서 바로 반영한다.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("unsupported");
      setCityId(fallbackCityId());
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nearbyId = resolveNearbyCityId({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        if (nearbyId) {
          setStatus("granted-nearby");
          setCityId(nearbyId);
        } else {
          setStatus("granted-far");
          setCityId(fallbackCityId());
        }
      },
      (error) => {
        setStatus(error.code === error.PERMISSION_DENIED ? "denied" : "error");
        setCityId(fallbackCityId());
      }
    );
  }, []);

  const places = cityId ? getNearbyPlaces(cityId) : [];

  return (
    <section
      aria-label="내 위치 주변 정보"
      className="flex w-full max-w-2xl flex-col gap-4 rounded-xl border border-border bg-card p-6"
    >
      <h2 className="text-lg font-semibold text-foreground">내 위치 주변 정보</h2>
      <p className="text-sm text-muted-foreground">{STATUS_MESSAGE[status]}</p>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="nearby-city" className="text-sm font-medium text-foreground">
          도시 선택
        </label>
        <select
          id="nearby-city"
          className="h-9 w-fit rounded-md border border-input bg-background px-2.5 text-sm"
          value={cityId ?? ""}
          onChange={(event) => setCityId(event.target.value)}
        >
          {CITIES.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {cityId && (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {places.map((place) => {
            const imageBroken = brokenImageIds.has(place.id);
            return (
              <li key={place.id} className="flex flex-col gap-2 overflow-hidden rounded-lg border border-border">
                {imageBroken ? (
                  <div
                    role="img"
                    aria-label={`${place.name} 이미지 없음`}
                    className="flex h-32 w-full items-center justify-center bg-muted text-xs text-muted-foreground"
                  >
                    이미지를 불러올 수 없습니다
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element -- 외부 Wikimedia Commons 이미지라 next/image 최적화 대상이 아니다.
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    className="h-32 w-full object-cover"
                    onError={() =>
                      setBrokenImageIds((prev) => {
                        const next = new Set(prev);
                        next.add(place.id);
                        return next;
                      })
                    }
                  />
                )}
                <div className="flex flex-col gap-0.5 px-3 pb-3">
                  <span className="text-sm font-medium text-foreground">{place.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {place.category === "food" ? "맛집" : "관광지"}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
