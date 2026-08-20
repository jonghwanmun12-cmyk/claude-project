"use client";

import { useEffect, useState } from "react";

import { MapPinned } from "lucide-react";

import { PlaceCard } from "@/components/place-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getNearbyPlaces } from "@/lib/nearby-places-data";
import { resolveNearbyCityId } from "@/lib/nearest-city";
import { CITIES, getCity } from "@/lib/travel-data";
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
  const sights = places.filter((place) => place.category === "sight");
  const foods = places.filter((place) => place.category === "food");
  const cafes = places.filter((place) => place.category === "cafe");
  const cityName = cityId ? (getCity(cityId)?.name ?? cityId) : "";

  return (
    <section
      aria-label="내 위치 주변 정보"
      className="flex w-full max-w-2xl flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <SectionHeading icon={MapPinned} title="내 위치 주변 정보" description="가까운 도시의 관광지·맛집 후보를 확인하세요" />
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
        <div className="flex flex-col gap-5">
          {sights.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-foreground">관광지 후보</h3>
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {sights.map((place) => (
                  <PlaceCard key={place.id} place={place} cityName={cityName} />
                ))}
              </ul>
            </div>
          )}
          {foods.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-foreground">맛집 후보</h3>
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {foods.map((place) => (
                  <PlaceCard key={place.id} place={place} cityName={cityName} />
                ))}
              </ul>
            </div>
          )}
          {cafes.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-foreground">카페 후보</h3>
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {cafes.map((place) => (
                  <PlaceCard key={place.id} place={place} cityName={cityName} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
