import { jsPDF } from "jspdf";

import type { DayPlanEntry } from "@/lib/day-plan";

/**
 * PDF에 한 줄씩 찍을 텍스트를 만든다. jsPDF 기본 폰트가 한글 글리프를
 * 지원하지 않아 로마자 표기(cityNameEn)를 쓴다 — 화면·ICS의 한글 표기와는
 * 이 때문에 다르다(같은 날짜·같은 도시를 가리키는 것은 동일하다).
 */
export function buildDayPlanLines(
  dayPlan: DayPlanEntry[],
  cityNameEn: (cityId: string) => string
): string[] {
  return dayPlan.map((entry) => `Day ${entry.dayNumber} (${entry.date}): ${cityNameEn(entry.cityId)}`);
}

export function buildDayPlanPdf(dayPlan: DayPlanEntry[], cityNameEn: (cityId: string) => string): jsPDF {
  const doc = new jsPDF();
  const marginX = 15;
  let y = 20;

  doc.setFontSize(16);
  doc.text("Italy Trip Itinerary", marginX, y);
  y += 12;

  doc.setFontSize(11);
  for (const line of buildDayPlanLines(dayPlan, cityNameEn)) {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, marginX, y);
    y += 8;
  }

  return doc;
}

export function buildDayPlanPdfBlob(
  dayPlan: DayPlanEntry[],
  cityNameEn: (cityId: string) => string
): Blob {
  return buildDayPlanPdf(dayPlan, cityNameEn).output("blob");
}
