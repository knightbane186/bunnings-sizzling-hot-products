const DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;

export function parseDate(dateText: string): Date {
  const match = DATE_PATTERN.exec(dateText);

  if (!match) {
    throw new Error(`Invalid date "${dateText}". Expected DD/MM/YYYY.`);
  }

  const [, dayText, monthText, yearText] = match;
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(`Invalid calendar date "${dateText}".`);
  }

  return date;
}

export function formatDate(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

export function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date.getTime());
  nextDate.setUTCDate(nextDate.getUTCDate() + days);

  return nextDate;
}

export function compareDates(a: string, b: string): number {
  return parseDate(a).getTime() - parseDate(b).getTime();
}

export function isDateInRange(
  dateText: string,
  startDate: string,
  endDate: string
): boolean {
  const dateTime = parseDate(dateText).getTime();

  return (
    dateTime >= parseDate(startDate).getTime() &&
    dateTime <= parseDate(endDate).getTime()
  );
}

export function getInclusiveDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  let cursor = parseDate(startDate);
  const endTime = parseDate(endDate).getTime();

  while (cursor.getTime() <= endTime) {
    dates.push(formatDate(cursor));
    cursor = addDays(cursor, 1);
  }

  return dates;
}

export function getLastNDays(
  today: string,
  days: number
): { startDate: string; endDate: string; dates: string[] } {
  if (!Number.isInteger(days) || days < 1) {
    throw new Error("days must be a positive integer.");
  }

  const todayDate = parseDate(today);
  const startDate = formatDate(addDays(todayDate, -(days - 1)));

  return {
    startDate,
    endDate: today,
    dates: getInclusiveDateRange(startDate, today)
  };
}
