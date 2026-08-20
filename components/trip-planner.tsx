"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { buildHotelSearchUrl, TRAIN_BOOKING_HOMEPAGE_URL } from "@/lib/booking-links";
import { buildItinerary } from "@/lib/itinerary";
import { CITIES, getCity } from "@/lib/travel-data";
import { computeNights, computeRoute, MAX_VIA_CITIES, type RoutePlan } from "@/lib/route-planner";
import { loadTrip, saveTrip, type StoredTrip } from "@/lib/trip-storage";

const DEFAULT_ARRIVAL: StoredTrip = {
  arrivalCityId: "rome",
  arrivalDateTime: "",
  departureCityId: "venice",
  departureDateTime: "",
  mustVisitCityIds: [],
};

function formatHours(hours: number): string {
  // 여러 구간의 소수 시간을 더하면 부동소수점 오차로 59.9999...분처럼 60분에
  // 아주 가까운 값이 나올 수 있다. 분을 올림한 뒤 60이 되면 시간으로 올려준다.
  let wholeHours = Math.floor(hours);
  let minutes = Math.round((hours - wholeHours) * 60);
  if (minutes === 60) {
    wholeHours += 1;
    minutes = 0;
  }
  if (minutes === 0) return `${wholeHours}시간`;
  return `${wholeHours}시간 ${minutes}분`;
}

function formatDateKorean(dateOnly: string): string {
  const [, month, day] = dateOnly.split("-").map(Number);
  return `${month}월 ${day}일`;
}

export function TripPlanner() {
  const [trip, setTrip] = useState<StoredTrip>(DEFAULT_ARRIVAL);
  const [hasLoaded, setHasLoaded] = useState(false);

  // 서버에는 localStorage가 없으므로, 렌더링 시점에 바로 읽으면 서버가
  // 그려준 기본값과 클라이언트 값이 달라져 하이드레이션 오류가 난다. 마운트
  // 이후에만 저장된 값을 읽어와 반영한다.
  useEffect(() => {
    const stored = loadTrip();
    // 브라우저 전용 저장소를 마운트 후 1회 읽어와 반영하는 경로라, 하이드레이션
    // 불일치를 피하려면 이 방식이 필요하다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setTrip(stored);
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    saveTrip(trip);
  }, [trip, hasLoaded]);

  const { plan, error } = useMemo<{ plan: RoutePlan | null; error: string | null }>(() => {
    if (!trip.arrivalDateTime || !trip.departureDateTime) {
      return { plan: null, error: null };
    }
    if (new Date(trip.departureDateTime).getTime() <= new Date(trip.arrivalDateTime).getTime()) {
      return { plan: null, error: "출발 시간은 도착 시간보다 나중이어야 합니다." };
    }
    try {
      const nights = computeNights(trip.arrivalDateTime, trip.departureDateTime);
      return {
        plan: computeRoute({
          arrivalCityId: trip.arrivalCityId,
          departureCityId: trip.departureCityId,
          nights,
          mustVisitCityIds: trip.mustVisitCityIds,
        }),
        error: null,
      };
    } catch (err) {
      return { plan: null, error: err instanceof Error ? err.message : "루트를 계산할 수 없습니다." };
    }
  }, [trip]);

  // 각 도시에 머무는 날짜 구간(체크인/체크아웃 근사치) — 예약 딥링크에 채울
  // 날짜가 필요해서 계산한다. plan이 없으면(입력 미완/오류) 빈 배열.
  const itinerary = useMemo(
    () => (plan ? buildItinerary(plan, trip.arrivalDateTime, trip.departureDateTime) : []),
    [plan, trip.arrivalDateTime, trip.departureDateTime]
  );

  // 도착/출발 도시는 경유지 선택 목록에 낼 필요가 없다 — 어차피 루트의
  // 시작/끝으로 고정되어 있고, computeRoute도 이 둘을 제외하고 계산한다.
  const mustVisitCandidates = CITIES.filter(
    (city) => city.id !== trip.arrivalCityId && city.id !== trip.departureCityId
  );
  const mustVisitLimitReached = trip.mustVisitCityIds.length >= MAX_VIA_CITIES;

  function toggleMustVisit(cityId: string) {
    setTrip((prev) => {
      const already = prev.mustVisitCityIds.includes(cityId);
      if (already) {
        return { ...prev, mustVisitCityIds: prev.mustVisitCityIds.filter((id) => id !== cityId) };
      }
      if (prev.mustVisitCityIds.length >= MAX_VIA_CITIES) return prev;
      return { ...prev, mustVisitCityIds: [...prev.mustVisitCityIds, cityId] };
    });
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      <form
        className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="arrival-city" className="text-sm font-medium text-foreground">
              도착 도시
            </label>
            <select
              id="arrival-city"
              className="h-9 rounded-md border border-input bg-background px-2.5 text-sm"
              value={trip.arrivalCityId}
              onChange={(event) => {
                const cityId = event.target.value;
                setTrip((prev) => ({
                  ...prev,
                  arrivalCityId: cityId,
                  mustVisitCityIds: prev.mustVisitCityIds.filter((id) => id !== cityId),
                }));
              }}
            >
              {CITIES.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="arrival-time" className="text-sm font-medium text-foreground">
              도착 일시
            </label>
            <input
              id="arrival-time"
              type="datetime-local"
              className="h-9 rounded-md border border-input bg-background px-2.5 text-sm"
              value={trip.arrivalDateTime}
              onChange={(event) => setTrip((prev) => ({ ...prev, arrivalDateTime: event.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="departure-city" className="text-sm font-medium text-foreground">
              출발 도시
            </label>
            <select
              id="departure-city"
              className="h-9 rounded-md border border-input bg-background px-2.5 text-sm"
              value={trip.departureCityId}
              onChange={(event) => {
                const cityId = event.target.value;
                setTrip((prev) => ({
                  ...prev,
                  departureCityId: cityId,
                  mustVisitCityIds: prev.mustVisitCityIds.filter((id) => id !== cityId),
                }));
              }}
            >
              {CITIES.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="departure-time" className="text-sm font-medium text-foreground">
              출발 일시
            </label>
            <input
              id="departure-time"
              type="datetime-local"
              className="h-9 rounded-md border border-input bg-background px-2.5 text-sm"
              value={trip.departureDateTime}
              onChange={(event) => setTrip((prev) => ({ ...prev, departureDateTime: event.target.value }))}
            />
          </div>
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-foreground">
            꼭 가고 싶은 지역 (최대 {MAX_VIA_CITIES}곳, 선택하지 않아도 됩니다)
          </legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {mustVisitCandidates.map((city) => {
              const checked = trip.mustVisitCityIds.includes(city.id);
              return (
                <label
                  key={city.id}
                  className="flex items-center gap-1.5 text-sm text-foreground"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={!checked && mustVisitLimitReached}
                    onChange={() => toggleMustVisit(city.id)}
                  />
                  {city.name}
                </label>
              );
            })}
          </div>
          {mustVisitLimitReached && (
            <p className="text-xs text-muted-foreground">
              최대 {MAX_VIA_CITIES}곳까지 선택할 수 있어요. 다른 지역을 고르려면 먼저 하나를 해제하세요.
            </p>
          )}
        </fieldset>

        <Button type="submit" className="w-fit">
          루트 추천받기
        </Button>
      </form>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {plan && (
        <section aria-label="추천 루트" className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">추천 루트</h2>
          <ol className="flex flex-col gap-2">
            {plan.cityIds.map((cityId, index) => {
              const cityName = getCity(cityId)?.name ?? cityId;
              const stay = itinerary[index];
              const leg = plan.legs[index];
              return (
                <li key={`${cityId}-${index}`} className="flex flex-col gap-1">
                  <span className="font-medium text-foreground">
                    {index + 1}. {cityName}
                  </span>
                  {stay && (
                    <a
                      href={buildHotelSearchUrl(cityName, stay.checkIn, stay.checkOut)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary underline underline-offset-2"
                    >
                      {formatDateKorean(stay.checkIn)}~{formatDateKorean(stay.checkOut)} 숙소 검색 (Booking.com)
                    </a>
                  )}
                  {leg && stay && (
                    <span className="flex flex-wrap items-baseline gap-2 text-sm text-muted-foreground">
                      <span>
                        ↓ {formatDateKorean(stay.checkOut)}, 기차 약 {formatHours(leg.hours)}
                      </span>
                      <a
                        href={TRAIN_BOOKING_HOMEPAGE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline underline-offset-2"
                      >
                        Trenitalia에서 열차 검색
                      </a>
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          <p className="text-sm text-muted-foreground">
            총 이동 시간: 약 {formatHours(plan.totalHours)}
          </p>
        </section>
      )}
    </div>
  );
}
