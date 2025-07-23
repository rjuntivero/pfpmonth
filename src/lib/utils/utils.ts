export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function toSlug(monthIndex: number, year: number): string {
  const monthName = MONTHS[monthIndex];
  return `${monthName}-${year}`;
}

export function parseSlug(slug: string): [string, Date] | null {
  const [monthName, year] = slug?.split('-') || ['null', 'null'];

  // Normalize MONTHS before comparison
  const monthIndex = MONTHS.findIndex((m) => m.toLowerCase() === monthName.toLowerCase());

  if (monthIndex === -1 || isNaN(Number(year))) {
    console.warn('Invalid slug provided:', slug);
    return null;
  }

  const utcDate = new Date(Date.UTC(Number(year), monthIndex, 1));
  const dateString = utcDate.toISOString().split('T')[0];

  return [dateString, utcDate];
}
