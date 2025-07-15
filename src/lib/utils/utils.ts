const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

export function toSlug(monthIndex: number, year: number): string {
  const monthName = MONTHS[monthIndex].toLowerCase();
  return `${monthName}-${year}`;
}

export function parseSlug(slug: string): [string, Date] | null {
  const [monthName, year] = slug?.split('-') || ['null', 'null'];

  const monthIndex = MONTHS.indexOf(monthName.toLowerCase());

  if (monthIndex === -1 || isNaN(Number(year))) {
    console.warn('Invalid slug provided:', slug);
    return null;
  }

  const utcDate = new Date(Date.UTC(Number(year), monthIndex, 1));
  const dateString = utcDate.toISOString().split('T')[0];

  return [dateString, utcDate];
}
