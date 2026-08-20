// 도시별 맛집·관광지 큐레이션 정적 데이터.
// 외부 실시간 장소 검색 API 없이 준비한다 — 근거:
// docs/decisions/data-and-booking-strategy.md, docs/specs/italy-travel-planner/tasks/05-nearby-places.md
//
// 이미지는 Wikimedia Commons의 Special:FilePath 경로를 쓴다. 실제 업로드 해시를
// 몰라도 파일명만으로 안정적인 URL을 만들 수 있어서다. 다만 정확한 파일명은
// 구현 시점의 최선 추정이라 일부는 깨질 수 있다 — 그 경우 항목은 그대로 두고
// 이미지 자리만 대체 표시하는 것이 이 태스크의 수용 기준이다.
export type NearbyPlace = {
  id: string;
  name: string;
  category: "food" | "sight";
  imageUrl: string;
};

function commonsFilePath(fileName: string): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
}

export const NEARBY_PLACES: Record<string, NearbyPlace[]> = {
  rome: [
    { id: "rome-colosseum", name: "콜로세움", category: "sight", imageUrl: commonsFilePath("Colosseum in Rome, Italy - April 2007.jpg") },
    { id: "rome-cacio-e-pepe", name: "카치오 에 페페 맛집", category: "food", imageUrl: commonsFilePath("Cacio e pepe.jpg") },
  ],
  florence: [
    { id: "florence-ponte-vecchio", name: "폰테 베키오", category: "sight", imageUrl: commonsFilePath("Ponte Vecchio, Florence.jpg") },
    { id: "florence-bistecca", name: "비스테카 알라 피오렌티나 맛집", category: "food", imageUrl: commonsFilePath("Bistecca alla fiorentina.jpg") },
  ],
  venice: [
    { id: "venice-san-marco", name: "산 마르코 광장", category: "sight", imageUrl: commonsFilePath("Piazza San Marco, Venice.jpg") },
    { id: "venice-grand-canal", name: "그란데 운하", category: "sight", imageUrl: commonsFilePath("Canal Grande Venice.jpg") },
  ],
  milan: [
    { id: "milan-duomo", name: "밀라노 두오모", category: "sight", imageUrl: commonsFilePath("Duomo di Milano.jpg") },
    { id: "milan-risotto", name: "리조토 알라 밀라네제 맛집", category: "food", imageUrl: commonsFilePath("Risotto alla milanese.jpg") },
  ],
  naples: [
    { id: "naples-panorama", name: "나폴리 항구 전경", category: "sight", imageUrl: commonsFilePath("Panorama view of bay and the city Naples, Campania, Italy, May 2005 (52104979928).jpg") },
    { id: "naples-pizza", name: "피자 마르게리타 맛집", category: "food", imageUrl: commonsFilePath("Pizza Margherita 01.jpg") },
  ],
  bologna: [
    { id: "bologna-piazza-maggiore", name: "피아자 마조레", category: "sight", imageUrl: commonsFilePath("Piazza Maggiore (Bologna).jpg") },
    { id: "bologna-tagliatelle", name: "탈리아텔레 알 라구 맛집", category: "food", imageUrl: commonsFilePath("Tagliatelle al ragù.jpg") },
  ],
  verona: [
    { id: "verona-arena", name: "베로나 아레나", category: "sight", imageUrl: commonsFilePath("Verona Arena.jpg") },
    { id: "verona-amarone", name: "리조토 알아마로네 맛집", category: "food", imageUrl: commonsFilePath("A bottle of Amarone della Valpolicella.jpg") },
  ],
  pisa: [
    { id: "pisa-tower", name: "피사의 사탑", category: "sight", imageUrl: commonsFilePath("Piazza dei Miracoli, Pisa.jpg") },
    { id: "pisa-cecina", name: "체치나 맛집", category: "food", imageUrl: commonsFilePath("Cecina (food).jpg") },
  ],
  turin: [
    { id: "turin-mole", name: "몰레 안토넬리아나", category: "sight", imageUrl: commonsFilePath("Mole Antonelliana, Turin.jpg") },
    { id: "turin-bicerin", name: "비체린 맛집", category: "food", imageUrl: commonsFilePath("Bicerin.jpg") },
  ],
  genoa: [
    { id: "genoa-porto-antico", name: "포르토 안티코", category: "sight", imageUrl: commonsFilePath("Porto Antico di Genova.jpg") },
    { id: "genoa-pesto", name: "페스토 알라 제노베제 맛집", category: "food", imageUrl: commonsFilePath("Pesto alla genovese.jpg") },
  ],
};

export function getNearbyPlaces(cityId: string): NearbyPlace[] {
  return NEARBY_PLACES[cityId] ?? [];
}
