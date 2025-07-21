import { NextResponse } from 'next/server';
import { fetchThemes } from '@/lib/api/theme/fetchThemes';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get('year') ?? `${new Date().getFullYear()}`, 10);

  const result = await fetchThemes(year);
  return NextResponse.json({ slides: result.themes });
}
