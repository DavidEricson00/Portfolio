import type { Experience } from "@/types/experience";

const MONTH_NAMES_SHORT = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
];

/**
 * Parses a YYYY-MM-DD date string safely in local time
 */
function parseDateParts(dateStr: string): { year: number; month: number; day: number } {
  const [yearStr, monthStr, dayStr] = dateStr.split("-");
  return {
    year: parseInt(yearStr, 10),
    month: parseInt(monthStr, 10) - 1, // 0-indexed month
    day: parseInt(dayStr, 10),
  };
}

/**
 * Calculates the duration in months for a single experience using calendar months
 */
export function calculateSingleExperienceMonths(
  startDateStr: string,
  endDateStr: string | null
): number {
  const start = parseDateParts(startDateStr);

  let endYear: number;
  let endMonth: number;
  let endDay: number;

  if (endDateStr) {
    const end = parseDateParts(endDateStr);
    endYear = end.year;
    endMonth = end.month;
    endDay = end.day;
  } else {
    const now = new Date();
    endYear = now.getFullYear();
    endMonth = now.getMonth();
    endDay = now.getDate();
  }

  let totalMonths = (endYear - start.year) * 12 + (endMonth - start.month);

  // If the end day covers the month (e.g. start on 1st, end on last day or later), count full month
  if (endDateStr) {
    // For fixed periods with complete calendar months (e.g. 2025-04-01 to 2025-06-30): inclusive month count
    totalMonths += 1;
  } else {
    // For current ongoing experience
    if (endDay >= start.day) {
      totalMonths += 1;
    }
  }

  return Math.max(1, totalMonths);
}

/**
 * Calculates the total sum of duration in months across all individual experiences
 */
export function calculateExperienceMonths(experiences: Experience[]): number {
  return experiences.reduce((acc, exp) => {
    return acc + calculateSingleExperienceMonths(exp.startDate, exp.endDate);
  }, 0);
}

/**
 * Formats duration in months to human-readable Portuguese string
 * e.g. "9 meses", "1 ano", "1 ano e 2 meses", "2 anos", "2 anos e 1 mês"
 */
export function formatExperienceDuration(totalMonths: number): string {
  if (totalMonths <= 0) {
    return "0 meses";
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0) {
    return `${months} ${months === 1 ? "mês" : "meses"}`;
  }

  const yearPart = `${years} ${years === 1 ? "ano" : "anos"}`;

  if (months === 0) {
    return yearPart;
  }

  const monthPart = `${months} ${months === 1 ? "mês" : "meses"}`;
  return `${yearPart} e ${monthPart}`;
}

/**
 * Formats a period range for visual display, e.g. "ABR 2025 - JUN 2025" or "MAI 2026 - ATUAL"
 */
export function formatExperiencePeriod(
  startDateStr: string,
  endDateStr: string | null
): string {
  const start = parseDateParts(startDateStr);
  const startFormatted = `${MONTH_NAMES_SHORT[start.month]} ${start.year}`;

  if (!endDateStr) {
    return `${startFormatted} - PRESENTE`;
  }

  const end = parseDateParts(endDateStr);
  const endFormatted = `${MONTH_NAMES_SHORT[end.month]} ${end.year}`;

  return `${startFormatted} - ${endFormatted}`;
}

/**
 * Sorts experiences chronologically (oldest to newest)
 */
export function sortExperiencesChronologically<T extends Experience>(
  experiences: T[]
): T[] {
  return [...experiences].sort((a, b) => {
    return a.startDate.localeCompare(b.startDate);
  });
}
