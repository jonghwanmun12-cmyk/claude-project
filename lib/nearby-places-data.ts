// 도시별 맛집·관광지 큐레이션 정적 데이터.
// 외부 실시간 장소 검색 API 없이 준비한다 — 근거:
// docs/decisions/data-and-booking-strategy.md, docs/specs/italy-travel-planner/tasks/05-nearby-places.md,
// docs/specs/italy-travel-planner/tasks/12-nearby-places-candidates.md
//
// 이미지는 Wikimedia Commons의 Special:FilePath 경로를 쓴다. 실제 업로드 해시를
// 몰라도 파일명만으로 안정적인 URL을 만들 수 있어서다. 다만 정확한 파일명은
// 구현 시점의 최선 추정이라 일부는 깨질 수 있다 — 그 경우 항목은 그대로 두고
// 이미지 자리만 대체 표시하는 것이 이 태스크의 수용 기준이다.
export type NearbyPlace = {
  id: string;
  name: string;
  category: "food" | "sight" | "cafe";
  imageUrl: string;
};

export function commonsFilePath(fileName: string): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
}

export const NEARBY_PLACES: Record<string, NearbyPlace[]> = {
  rome: [
    { id: "rome-colosseum", name: "콜로세움", category: "sight", imageUrl: commonsFilePath("Colosseum in Rome, Italy - April 2007.jpg") },
    { id: "rome-trevi", name: "트레비 분수", category: "sight", imageUrl: commonsFilePath("Oceanus (Trevi fountain).jpg") },
    { id: "rome-pantheon", name: "판테온", category: "sight", imageUrl: commonsFilePath("Pantheon Rome.jpg") },
    { id: "rome-spanish-steps", name: "스페인 계단", category: "sight", imageUrl: commonsFilePath("Spanish Steps, Rome, September 1965.jpg") },
    { id: "rome-piazza-campidoglio", name: "캄피돌리오 광장", category: "sight", imageUrl: commonsFilePath("Fountain in Piazza del Campidoglio (Rome) - Nile.jpg") },
    { id: "rome-cacio-e-pepe", name: "카치오 에 페페 맛집", category: "food", imageUrl: commonsFilePath("Cacio e pepe.jpg") },
    { id: "rome-carbonara", name: "카르보나라 맛집", category: "food", imageUrl: commonsFilePath("Spaghetti alla Carbonara.jpg") },
    { id: "rome-supplì", name: "수플리 맛집", category: "food", imageUrl: commonsFilePath("Supplì.jpg") },
    { id: "rome-cafe-greco", name: "카페 그레코", category: "cafe", imageUrl: commonsFilePath("Antico Caffè Greco (Rome - Italy) - Buffalo Bill, Sitting Bull, Black Elk and Diego Angeli - 1890.png") },
    { id: "rome-cafe-generic", name: "로마 에스프레소 카페", category: "cafe", imageUrl: commonsFilePath("Cornetto e cappuccino.jpg") },
  ],
  florence: [
    { id: "florence-ponte-vecchio", name: "폰테 베키오", category: "sight", imageUrl: commonsFilePath("Ponte Vecchio, Florence.jpg") },
    { id: "florence-duomo", name: "피렌체 두오모", category: "sight", imageUrl: commonsFilePath("Florence Duomo from Michelangelo hill.jpg") },
    { id: "florence-uffizi", name: "우피치 미술관", category: "sight", imageUrl: commonsFilePath("Uffizi Gallery, Florence.jpg") },
    { id: "florence-piazza-signoria", name: "시뇨리아 광장", category: "sight", imageUrl: commonsFilePath("Florence - David - tête.jpg") },
    { id: "florence-boboli", name: "보볼리 정원", category: "sight", imageUrl: commonsFilePath("Jardín de Bóboli, Florencia, Italia, 2022-09-19, DD 26.jpg") },
    { id: "florence-bistecca", name: "비스테카 알라 피오렌티나 맛집", category: "food", imageUrl: commonsFilePath("Bistecca alla fiorentina.jpg") },
    { id: "florence-pappa-pomodoro", name: "파파 알 포모도로 맛집", category: "food", imageUrl: commonsFilePath("Pappa al pomodoro.jpg") },
    { id: "florence-gelato", name: "젤라또 맛집", category: "food", imageUrl: commonsFilePath("Gelato Firenze 2007.jpg") },
    { id: "florence-cafe-gilli", name: "카페 질리", category: "cafe", imageUrl: commonsFilePath("Gilli (Florence) Piazza della Repubblica.jpg") },
    { id: "florence-cafe-generic", name: "피렌체 에스프레소 카페", category: "cafe", imageUrl: commonsFilePath("Cornetto e cappuccino.jpg") },
  ],
  venice: [
    { id: "venice-san-marco", name: "산 마르코 광장", category: "sight", imageUrl: commonsFilePath("Piazza San Marco, Venice.jpg") },
    { id: "venice-grand-canal", name: "그란데 운하", category: "sight", imageUrl: commonsFilePath("Canal Grande Venice.jpg") },
    { id: "venice-rialto", name: "리알토 다리", category: "sight", imageUrl: commonsFilePath("Panorama of Canal Grande and Ponte di Rialto, Venice - September 2017.jpg") },
    { id: "venice-accademia-bridge", name: "아카데미아 다리", category: "sight", imageUrl: commonsFilePath("Ponte dell'Accademia Canal Grande Venezia.jpg") },
    { id: "venice-burano", name: "부라노 섬", category: "sight", imageUrl: commonsFilePath("Burano Hausfassade Wäsche-20090315-RM-113043.jpg") },
    { id: "venice-sarde-in-saor", name: "사르데 인 사오르 맛집", category: "food", imageUrl: commonsFilePath("Sarde in saòr.jpg") },
    { id: "venice-risotto-nero", name: "리조토 알 네로 디 세피아 맛집", category: "food", imageUrl: commonsFilePath("Risotto al nero di seppia.jpg") },
    { id: "venice-spritz", name: "스프리츠 바", category: "food", imageUrl: commonsFilePath("Aperol Spritz - Santa Ynez Kitchen - Sarah Stierch.jpg") },
    { id: "venice-cafe-florian", name: "카페 플로리안", category: "cafe", imageUrl: commonsFilePath("Venedig Caffè Florian Eingang-20110312-RM-185109.jpg") },
    { id: "venice-cafe-generic", name: "베네치아 에스프레소 카페", category: "cafe", imageUrl: commonsFilePath("Cornetto e cappuccino.jpg") },
  ],
  milan: [
    { id: "milan-duomo", name: "밀라노 두오모", category: "sight", imageUrl: commonsFilePath("Duomo di Milano.jpg") },
    { id: "milan-galleria", name: "비토리오 에마누엘레 2세 갤러리아", category: "sight", imageUrl: commonsFilePath("Galleria Vittorio Emanuele II Milan.jpg") },
    { id: "milan-sforza", name: "스포르차 성", category: "sight", imageUrl: commonsFilePath("Castello Sforzesco, Milano (facciata 1).png") },
    { id: "milan-navigli", name: "나빌리 운하", category: "sight", imageUrl: commonsFilePath("Navigli (27105017476).jpg") },
    { id: "milan-brera", name: "브레라 지구", category: "sight", imageUrl: commonsFilePath("\" 12 Milan Design Week (Fuorisalone) Brera district 01.JPG") },
    { id: "milan-risotto", name: "리조토 알라 밀라네제 맛집", category: "food", imageUrl: commonsFilePath("Risotto allo zafferano (5515768228).jpg") },
    { id: "milan-ossobuco", name: "오소부코 맛집", category: "food", imageUrl: commonsFilePath("Ossobuco con risotto alla milanese.jpg") },
    { id: "milan-panettone", name: "파네토네 맛집", category: "food", imageUrl: commonsFilePath("Panettone.jpg") },
    { id: "milan-cafe-cova", name: "카페 코바", category: "cafe", imageUrl: commonsFilePath("Milan Montenapoaleone 14.JPG") },
    { id: "milan-cafe-generic", name: "밀라노 에스프레소 카페", category: "cafe", imageUrl: commonsFilePath("Cornetto e cappuccino.jpg") },
  ],
  naples: [
    { id: "naples-panorama", name: "나폴리 항구 전경", category: "sight", imageUrl: commonsFilePath("Panorama view of bay and the city Naples, Campania, Italy, May 2005 (52104979928).jpg") },
    { id: "naples-spaccanapoli", name: "스파카나폴리", category: "sight", imageUrl: commonsFilePath("Naples spaccanapoli.JPG") },
    { id: "naples-castel-dellovo", name: "카스텔 델로보", category: "sight", imageUrl: commonsFilePath("Cannoni a Castel dell'Ovo a Napoli.jpg") },
    { id: "naples-capodimonte", name: "카포디몬테 궁전", category: "sight", imageUrl: commonsFilePath("Sommer, Giorgio (1834-1914) - n° 287 - Palazzo di Capodimonte - Napoli.jpg") },
    { id: "naples-sant-elmo", name: "산텔모 성", category: "sight", imageUrl: commonsFilePath("Castel Sant Elmo Napoli lato ingresso.jpg") },
    { id: "naples-pizza", name: "피자 마르게리타 맛집", category: "food", imageUrl: commonsFilePath("Pizza Margherita 01.jpg") },
    { id: "naples-sfogliatella", name: "스폴리아텔라 맛집", category: "food", imageUrl: commonsFilePath("Sfogliatella riccia napoletana.jpg") },
    { id: "naples-ragu", name: "라구 나폴레타노 맛집", category: "food", imageUrl: commonsFilePath("Ragù napoletano.jpg") },
    { id: "naples-cafe-gambrinus", name: "그란 카페 감브리누스", category: "cafe", imageUrl: commonsFilePath("Gran Caffè Gambrinus – Naples (2014).jpg") },
    { id: "naples-cafe-generic", name: "나폴리 에스프레소 카페", category: "cafe", imageUrl: commonsFilePath("Cornetto e cappuccino.jpg") },
  ],
  bologna: [
    { id: "bologna-piazza-maggiore", name: "피아자 마조레", category: "sight", imageUrl: commonsFilePath("Piazza Maggiore (Bologna).jpg") },
    { id: "bologna-due-torri", name: "두 개의 탑", category: "sight", imageUrl: commonsFilePath("Due Torri - Bologna.jpg") },
    { id: "bologna-san-luca", name: "산 루카 성당", category: "sight", imageUrl: commonsFilePath("Bologna, santuario della Madonna di San Luca 02.jpg") },
    { id: "bologna-nettuno", name: "넵투누스 분수", category: "sight", imageUrl: commonsFilePath("(Bologna) - Fontana del Nettuno.jpg") },
    { id: "bologna-san-petronio", name: "산 페트로니오 대성당", category: "sight", imageUrl: commonsFilePath("Bologna - Basilica di San Petronio - Crocifisso dell'Altare Maggiore - HDR - GT 04 - 2025-09-27 12-42-25 001.jpg") },
    { id: "bologna-tagliatelle", name: "탈리아텔레 알 라구 맛집", category: "food", imageUrl: commonsFilePath("Tagliatelle al ragù 03.jpg") },
    { id: "bologna-tortellini", name: "토르텔리니 인 브로도 맛집", category: "food", imageUrl: commonsFilePath("Tortellini in brodo - Bologna.jpg") },
    { id: "bologna-mortadella", name: "모르타델라 맛집", category: "food", imageUrl: commonsFilePath("Mortadella Bologna IGP.jpg") },
    { id: "bologna-cafe-generic-1", name: "볼로냐 에스프레소 카페", category: "cafe", imageUrl: commonsFilePath("Cornetto e cappuccino.jpg") },
    { id: "bologna-cafe-generic-2", name: "볼로냐 카푸치노 카페", category: "cafe", imageUrl: commonsFilePath("Cornetto e cappuccino.jpg") },
  ],
  verona: [
    { id: "verona-arena", name: "베로나 아레나", category: "sight", imageUrl: commonsFilePath("Verona Arena.jpg") },
    { id: "verona-ponte-pietra", name: "폰테 피에트라", category: "sight", imageUrl: commonsFilePath("Ponte Pietra and San Giorgio in Braida. Verona, Italy.jpg") },
    { id: "verona-juliet-house", name: "줄리엣의 집", category: "sight", imageUrl: commonsFilePath("Casa di Giulietta-Verona 01.jpg") },
    { id: "verona-castelvecchio", name: "카스텔베키오", category: "sight", imageUrl: commonsFilePath("The Keep of Castelvecchio and Ponte Scaligero Verona Italy.jpg") },
    { id: "verona-piazza-erbe", name: "피아자 에르베", category: "sight", imageUrl: commonsFilePath("Piazza delle Erbe - Palazzo Maffei (Verona).jpg") },
    { id: "verona-amarone", name: "리조토 알아마로네 맛집", category: "food", imageUrl: commonsFilePath("A bottle of Amarone della Valpolicella.jpg") },
    { id: "verona-pastissada", name: "파스티사다 맛집", category: "food", imageUrl: commonsFilePath("Pastissada de caval.jpg") },
    { id: "verona-valpolicella", name: "발폴리첼라 와인바", category: "food", imageUrl: commonsFilePath("Bottle and partial glass of Valpolicella.jpg") },
    { id: "verona-cafe-generic-1", name: "베로나 에스프레소 카페", category: "cafe", imageUrl: commonsFilePath("Cornetto e cappuccino.jpg") },
    { id: "verona-cafe-generic-2", name: "베로나 카푸치노 카페", category: "cafe", imageUrl: commonsFilePath("Cornetto e cappuccino.jpg") },
  ],
  pisa: [
    { id: "pisa-tower", name: "피사의 사탑", category: "sight", imageUrl: commonsFilePath("Pisa - Piazza dei Miracoli - Cherubs.jpg") },
    { id: "pisa-duomo", name: "피사 두오모", category: "sight", imageUrl: commonsFilePath("Il soffitto del Duomo di Pisa nel 2019.jpg") },
    { id: "pisa-camposanto", name: "캄포산토 기념묘지", category: "sight", imageUrl: commonsFilePath("Camposanto Monumentale di Pisa (16813099494).jpg") },
    { id: "pisa-lungarno", name: "아르노 강변", category: "sight", imageUrl: commonsFilePath("Lungarno (Pisa).jpg") },
    { id: "pisa-santa-maria-spina", name: "산타 마리아 델라 스피나 성당", category: "sight", imageUrl: commonsFilePath("Santa Maria della Spina (Pisa) on Lungarno.jpg") },
    { id: "pisa-cecina", name: "체치나 맛집", category: "food", imageUrl: commonsFilePath("Farinata di ceci 01.jpg") },
    { id: "pisa-bistecca", name: "토스카나식 스테이크 맛집", category: "food", imageUrl: commonsFilePath("Bistecca alla fiorentina.jpg") },
    { id: "pisa-cantucci", name: "칸투치 맛집", category: "food", imageUrl: commonsFilePath("Biscotti from Cossetta's.jpg") },
    { id: "pisa-cafe-generic-1", name: "피사 에스프레소 카페", category: "cafe", imageUrl: commonsFilePath("Cornetto e cappuccino.jpg") },
    { id: "pisa-cafe-generic-2", name: "피사 카푸치노 카페", category: "cafe", imageUrl: commonsFilePath("Cornetto e cappuccino.jpg") },
  ],
  turin: [
    { id: "turin-mole", name: "몰레 안토넬리아나", category: "sight", imageUrl: commonsFilePath("Mole Antonelliana di sera.jpg") },
    { id: "turin-piazza-castello", name: "카스텔로 광장", category: "sight", imageUrl: commonsFilePath("Piazza castello Turin 2-12-2024.jpg") },
    { id: "turin-egyptian-museum", name: "이집트 박물관", category: "sight", imageUrl: commonsFilePath("Museo Egizio e Galleria sabauda, Torino.jpg") },
    { id: "turin-superga", name: "수페르가 대성당", category: "sight", imageUrl: commonsFilePath("La basilica al tramonto.jpg") },
    { id: "turin-valentino", name: "발렌티노 성", category: "sight", imageUrl: commonsFilePath("Castello del Valentino settembre 2023.jpg") },
    { id: "turin-bicerin", name: "비체린 맛집", category: "food", imageUrl: commonsFilePath("Bicerin.jpg") },
    { id: "turin-agnolotti", name: "아뇰로티 델 플린 맛집", category: "food", imageUrl: commonsFilePath("Agnolotti single.png") },
    { id: "turin-gianduiotto", name: "잔두이오또 초콜릿 가게", category: "food", imageUrl: commonsFilePath("Gianduiotti.jpg") },
    { id: "turin-cafe-baratti", name: "카페 바라티 에 밀라노", category: "cafe", imageUrl: commonsFilePath("Caffè Baratti & Milano in Torino.jpg") },
    { id: "turin-cafe-generic", name: "토리노 에스프레소 카페", category: "cafe", imageUrl: commonsFilePath("Cornetto e cappuccino.jpg") },
  ],
  genoa: [
    { id: "genoa-porto-antico", name: "포르토 안티코", category: "sight", imageUrl: commonsFilePath("Genova Porto Antico Bigo 2.jpg") },
    { id: "genoa-old-town", name: "제노바 구시가지", category: "sight", imageUrl: commonsFilePath("Via Garibaldi e Palazzo Rosso a Genova, Italia (2007).jpg") },
    { id: "genoa-palazzo-spinola", name: "스피놀라 궁전", category: "sight", imageUrl: commonsFilePath("Genova - palazzo Giacomo Spinola - facciata - 02.jpg") },
    { id: "genoa-de-ferrari", name: "페라리 광장", category: "sight", imageUrl: commonsFilePath("Piazza De Ferrari Genova by Stephen Kleckner - 1.jpg") },
    { id: "genoa-san-lorenzo", name: "산 로렌초 대성당", category: "sight", imageUrl: commonsFilePath("Cattedrale di San Lorenzo Genoa.jpg") },
    { id: "genoa-pesto", name: "페스토 알라 제노베제 맛집", category: "food", imageUrl: commonsFilePath("Pesto alla genovese.jpg") },
    { id: "genoa-focaccia", name: "포카치아 맛집", category: "food", imageUrl: commonsFilePath("Focaccia Genovese 02.jpg") },
    { id: "genoa-farinata", name: "파리나타 맛집", category: "food", imageUrl: commonsFilePath("Farinata.jpg") },
    { id: "genoa-cafe-generic-1", name: "제노바 에스프레소 카페", category: "cafe", imageUrl: commonsFilePath("Cornetto e cappuccino.jpg") },
    { id: "genoa-cafe-generic-2", name: "제노바 카푸치노 카페", category: "cafe", imageUrl: commonsFilePath("Cornetto e cappuccino.jpg") },
  ],
  dolomites: [
    { id: "dolomites-tre-cime", name: "트레 치메 디 라바레도", category: "sight", imageUrl: commonsFilePath("Drei Zinnen Tre Cime di Lavaredo Dolomites.jpg") },
    { id: "dolomites-cortina", name: "코르티나 담페초 마을", category: "sight", imageUrl: commonsFilePath("Faloria Cortina d'Ampezzo 10.jpg") },
    { id: "dolomites-braies", name: "브라이에스 호수", category: "sight", imageUrl: commonsFilePath("Lago di Braies South Tyrol 3.jpg") },
    { id: "dolomites-canederli", name: "카네데를리 맛집", category: "food", imageUrl: commonsFilePath("Semmelknödel.jpg") },
    { id: "dolomites-casunziei", name: "카순치에이 맛집", category: "food", imageUrl: commonsFilePath("Casunziei alle rape rosse al rifugio Venezia cropped.jpg") },
    { id: "dolomites-speck", name: "스펙 맛집", category: "food", imageUrl: commonsFilePath("Speck sandwich at the Rifugio Sint Crusc.jpg") },
    { id: "dolomites-cafe-generic-1", name: "산장 카페", category: "cafe", imageUrl: commonsFilePath("Cornetto e cappuccino.jpg") },
    { id: "dolomites-cafe-generic-2", name: "코르티나 카페", category: "cafe", imageUrl: commonsFilePath("Cornetto e cappuccino.jpg") },
  ],
  amalfi: [
    { id: "amalfi-duomo", name: "아말피 두오모", category: "sight", imageUrl: commonsFilePath("Amalfi BW 2013-05-15 10-09-21.jpg") },
    { id: "amalfi-positano", name: "포지타노 절벽 마을", category: "sight", imageUrl: commonsFilePath("Positano (Italy) 04.jpg") },
    { id: "amalfi-ravello", name: "라벨로 빌라 루폴로", category: "sight", imageUrl: commonsFilePath("Ravello Villa Rufolo.JPG") },
    { id: "amalfi-limoncello", name: "리몬첼로 맛집", category: "food", imageUrl: commonsFilePath("Homemade limoncello.jpg") },
    { id: "amalfi-delizia", name: "델리치아 알 리몬네 맛집", category: "food", imageUrl: commonsFilePath("Delizia al limone.jpg") },
    { id: "amalfi-vongole", name: "스파게티 알레 봉골레 맛집", category: "food", imageUrl: commonsFilePath("Spaghetti alle vongole.jpg") },
    { id: "amalfi-cafe-generic-1", name: "아말피 해안 카페", category: "cafe", imageUrl: commonsFilePath("Cornetto e cappuccino.jpg") },
    { id: "amalfi-cafe-generic-2", name: "포지타노 카페", category: "cafe", imageUrl: commonsFilePath("Cornetto e cappuccino.jpg") },
  ],
};

export function getNearbyPlaces(cityId: string): NearbyPlace[] {
  return NEARBY_PLACES[cityId] ?? [];
}

function interleaveByCategory(places: NearbyPlace[]): NearbyPlace[] {
  const sights = places.filter((place) => place.category === "sight");
  const foods = places.filter((place) => place.category === "food");
  const interleaved: NearbyPlace[] = [];
  const rounds = Math.max(sights.length, foods.length);
  for (let i = 0; i < rounds; i++) {
    if (sights[i]) interleaved.push(sights[i]);
    if (foods[i]) interleaved.push(foods[i]);
  }
  return interleaved;
}

/** 체류 구간 안에서 dayIndexInStay번째 날의 구간(chunk)을 pool에서 순환(모듈로)으로 뽑는다. */
function pickRotatingChunk<T>(pool: T[], dayIndexInStay: number, totalDaysInStay: number, limit: number): T[] {
  if (pool.length === 0) return [];
  const chunkSize = Math.min(limit, Math.max(1, Math.ceil(pool.length / totalDaysInStay)));
  const start = (dayIndexInStay * chunkSize) % pool.length;
  const result: T[] = [];
  for (let i = 0; i < chunkSize && i < pool.length; i++) {
    result.push(pool[(start + i) % pool.length]);
  }
  return result;
}

/**
 * 일자별 일정 Day 카드에 쓸 관광지·맛집·카페 후보를 최대 limit개 뽑는다.
 * 카페가 있는 도시는 매일 카페를 정확히 1곳 고정으로 포함하고(체류 일수만큼
 * 카페 목록을 순환해 매일 다른 카페를 보여준다), 나머지 자리는 관광지·맛집을
 * 번갈아 섞어(관광지1, 맛집1, 관광지2, ...) 채운다.
 *
 * 같은 도시에 여러 날 머물 때(dayIndexInStay/totalDaysInStay, 왕복으로 같은
 * 도시를 두 번 방문해 구간이 나뉘어도 lib/day-plan.ts의 computeDayStayPositions가
 * 전체 기준으로 이어서 세어준다) 매 Day마다 후보 목록이 겹치지 않도록, 전체
 * 후보를 체류 일수만큼 구간으로 나누고 그중 dayIndexInStay번째 구간을
 * 순환(모듈로)으로 뽑는다. 후보 수가 적어 체류 일수를 못 채우면 처음부터
 * 다시 순환한다.
 */
export function getDayHighlights(
  cityId: string,
  dayIndexInStay = 0,
  totalDaysInStay = 1,
  limit = 5
): NearbyPlace[] {
  const places = getNearbyPlaces(cityId);
  const cafes = places.filter((place) => place.category === "cafe");
  const sightsAndFoods = interleaveByCategory(places.filter((place) => place.category !== "cafe"));

  const cafeSlot = pickRotatingChunk(cafes, dayIndexInStay, totalDaysInStay, 1);
  const remainingLimit = Math.max(0, limit - cafeSlot.length);
  const rest = pickRotatingChunk(sightsAndFoods, dayIndexInStay, totalDaysInStay, remainingLimit);

  return [...cafeSlot, ...rest];
}
