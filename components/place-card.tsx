"use client";

import { useState } from "react";

import { buildGoogleMapsSearchUrl } from "@/lib/google-maps-link";
import type { NearbyPlace } from "@/lib/nearby-places-data";

/**
 * 관광지·맛집 후보 카드. 내 위치 주변 정보(태스크 12)와 일자별 일정(태스크 13)이
 * 같은 카드를 재사용해 후보 데이터·구글맵 링크 표시 방식을 공유한다.
 */
export function PlaceCard({ place, cityName }: { place: NearbyPlace; cityName: string }) {
  const [imageBroken, setImageBroken] = useState(false);

  return (
    <li className="flex flex-col gap-2 overflow-hidden rounded-lg border border-border bg-background">
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
          onError={() => setImageBroken(true)}
        />
      )}
      <div className="flex flex-col gap-1 px-3 pb-3">
        <span className="text-sm font-medium text-foreground">{place.name}</span>
        <span className="text-xs text-muted-foreground">{place.category === "food" ? "맛집" : "관광지"}</span>
        <a
          href={buildGoogleMapsSearchUrl(place.name, cityName)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit text-xs text-primary underline underline-offset-2"
        >
          구글맵에서 보기
        </a>
      </div>
    </li>
  );
}
