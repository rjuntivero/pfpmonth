import { NextResponse } from 'next/server';
import { fetchThemeData } from '@/lib/api/theme/fetchThemeData';
import { parseSlug } from '@/lib/utils/stringUtils';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const themeMonth = url.searchParams.get('month');
  const parsedThemeMonth = parseSlug(themeMonth as string);

  if (!parsedThemeMonth) {
    return NextResponse.json({ error: 'Invalid month slug' }, { status: 400 });
  }
  const [dateString, _] = parsedThemeMonth;
  console.log('Parsed theme month:', dateString);

  if (!themeMonth) {
    return NextResponse.json({ error: 'Missing month param' }, { status: 400 });
  }

  const data = await fetchThemeData({ themeMonth: dateString });
  return NextResponse.json(data);
}
