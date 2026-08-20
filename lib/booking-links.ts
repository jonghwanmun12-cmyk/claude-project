// 예약 딥링크 생성. 근거: docs/decisions/data-and-booking-strategy.md
//
// 실제로 확인한 결과, 이탈리아 기차 예매 사이트(Trenitalia/Lefrecce,
// Trainline)는 도시명과 날짜만으로 만드는 간단한 검색 딥링크가 없다 —
// Trenitalia는 검색을 누르면 암호화된 토큰으로 리다이렉트되고, Trainline은
// 짐작한 쿼리 파라미터로는 404가 난다. 그래서 이동수단은 실제 예매
// 홈페이지로만 연결하고, 도시·날짜는 우리 화면에 텍스트로 보여준다.
export const TRAIN_BOOKING_HOMEPAGE_URL = "https://www.trenitalia.com";

/**
 * 숙소 검색 딥링크. Booking.com은 ss(검색어)·checkin·checkout 쿼리
 * 파라미터가 실제로 동작함을 확인했다(YYYY-MM-DD 형식).
 */
export function buildHotelSearchUrl(cityName: string, checkIn: string, checkOut: string): string {
  const params = new URLSearchParams({
    ss: cityName,
    checkin: checkIn,
    checkout: checkOut,
    group_adults: "1",
    no_rooms: "1",
  });
  return `https://www.booking.com/searchresults.html?${params.toString()}`;
}
