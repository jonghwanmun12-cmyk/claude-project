import type { DayPlanEntry } from "@/lib/day-plan";
import { addDays } from "@/lib/itinerary";

/** "YYYY-MM-DD" → "YYYYMMDD" (iCalendar DATE 값 형식) */
function toIcsDate(dateOnly: string): string {
  return dateOnly.replaceAll("-", "");
}

/**
 * 일자별 일정을 iCalendar(.ics) 문자열로 만든다. 하루짜리 종일 이벤트를
 * 날짜별로 하나씩 만든다. RFC 5545에 맞춰 줄바꿈은 CRLF를 쓴다.
 */
export function buildIcsContent(
  dayPlan: DayPlanEntry[],
  cityName: (cityId: string) => string
): string {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//italy-travel-planner//KO"];

  for (const entry of dayPlan) {
    const start = toIcsDate(entry.date);
    // 종일 이벤트의 DTEND는 배타적 끝(다음 날)이어야 한다.
    const end = toIcsDate(addDays(entry.date, 1));
    lines.push(
      "BEGIN:VEVENT",
      `UID:day-${entry.dayNumber}-${entry.cityId}@italy-travel-planner`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      `SUMMARY:Day ${entry.dayNumber}: ${cityName(entry.cityId)}`,
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
