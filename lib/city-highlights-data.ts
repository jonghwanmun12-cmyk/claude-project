// 지도 팝업에 쓰는 도시별 대표 이미지·간략 설명 큐레이션 정적 데이터.
// nearby-places-data.ts와 같은 방식(Wikimedia Commons Special:FilePath)으로
// 준비한다 — 파일명은 구현 시점 최선 추정이라 일부는 깨질 수 있고, 그 경우
// 항목은 남기고 이미지 자리만 대체 표시하는 것이 수용 기준이다.
// 근거: docs/specs/italy-travel-planner/tasks/10-region-map-with-info-popup.md

import { commonsFilePath } from "@/lib/nearby-places-data";

export type CityHighlight = {
  imageUrls: string[];
  description: string;
};

export const CITY_HIGHLIGHTS: Record<string, CityHighlight> = {
  rome: {
    imageUrls: [
      commonsFilePath("Colosseum in Rome, Italy - April 2007.jpg"),
      commonsFilePath("Oceanus (Trevi fountain).jpg"),
      commonsFilePath("Pantheon Rome.jpg"),
    ],
    description: "고대 로마 유적과 바로크 분수가 공존하는 이탈리아의 수도.",
  },
  florence: {
    imageUrls: [
      commonsFilePath("Ponte Vecchio, Florence.jpg"),
      commonsFilePath("Florence Duomo from Michelangelo hill.jpg"),
      commonsFilePath("Uffizi Gallery, Florence.jpg"),
    ],
    description: "르네상스 예술의 중심지, 두오모와 우피치 미술관이 있는 도시.",
  },
  venice: {
    imageUrls: [
      commonsFilePath("Piazza San Marco, Venice.jpg"),
      commonsFilePath("Canal Grande Venice.jpg"),
      commonsFilePath("Panorama of Canal Grande and Ponte di Rialto, Venice - September 2017.jpg"),
    ],
    description: "운하와 곤돌라로 유명한 물의 도시.",
  },
  milan: {
    imageUrls: [
      commonsFilePath("Duomo di Milano.jpg"),
      commonsFilePath("Galleria Vittorio Emanuele II Milan.jpg"),
    ],
    description: "패션과 디자인의 수도, 웅장한 두오모가 있는 도시.",
  },
  naples: {
    imageUrls: [
      commonsFilePath("Panorama view of bay and the city Naples, Campania, Italy, May 2005 (52104979928).jpg"),
      commonsFilePath("Pizza Margherita 01.jpg"),
      commonsFilePath("Vesuvius from Monte Somma (Panorama II).jpg"),
    ],
    description: "나폴리 피자의 본고장이자 베수비오 화산과 폼페이로 가는 관문.",
  },
  bologna: {
    imageUrls: [
      commonsFilePath("Piazza Maggiore (Bologna).jpg"),
      commonsFilePath("Due Torri - Bologna.jpg"),
    ],
    description: "이탈리아 미식의 중심지, 붉은 지붕과 두 개의 탑이 유명한 도시.",
  },
  verona: {
    imageUrls: [
      commonsFilePath("Verona Arena.jpg"),
      commonsFilePath("Ponte Pietra and San Giorgio in Braida. Verona, Italy.jpg"),
    ],
    description: "로미오와 줄리엣의 무대이자 고대 원형극장이 남아있는 도시.",
  },
  pisa: {
    imageUrls: [
      commonsFilePath("Pisa - Piazza dei Miracoli - Cherubs.jpg"),
      commonsFilePath("Il soffitto del Duomo di Pisa nel 2019.jpg"),
    ],
    description: "피사의 사탑으로 유명한 토스카나의 소도시.",
  },
  turin: {
    imageUrls: [
      commonsFilePath("Mole Antonelliana di sera.jpg"),
      commonsFilePath("Piazza castello Turin 2-12-2024.jpg"),
    ],
    description: "이탈리아 통일의 첫 수도이자 초콜릿·자동차 산업으로 유명한 도시.",
  },
  genoa: {
    imageUrls: [
      commonsFilePath("Genova Porto Antico Bigo 2.jpg"),
      commonsFilePath("Via Garibaldi e Palazzo Rosso a Genova, Italia (2007).jpg"),
    ],
    description: "이탈리아 최대 항구 도시이자 페스토 소스의 발상지.",
  },
  dolomites: {
    imageUrls: [
      commonsFilePath("Drei Zinnen Tre Cime di Lavaredo Dolomites.jpg"),
      commonsFilePath("Faloria Cortina d'Ampezzo 10.jpg"),
      commonsFilePath("Lago di Braies South Tyrol 3.jpg"),
    ],
    description: "뾰족한 봉우리와 청록빛 호수가 어우러진 이탈리아 북부의 산악 절경지.",
  },
  amalfi: {
    imageUrls: [
      commonsFilePath("Amalfi BW 2013-05-15 10-09-21.jpg"),
      commonsFilePath("Positano (Italy) 04.jpg"),
      commonsFilePath("Ravello Villa Rufolo.JPG"),
    ],
    description: "지중해를 내려다보는 파스텔빛 절벽 마을들이 이어지는 남부 해안 절경지.",
  },
};

export function getCityHighlight(cityId: string): CityHighlight | undefined {
  return CITY_HIGHLIGHTS[cityId];
}
