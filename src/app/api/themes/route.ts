import { NextResponse } from 'next/server';
import { fetchThemes } from '@/lib/api/theme/fetchThemes';

// fetch all themes for a given year (and server, if provided)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get('year') ?? `${new Date().getFullYear()}`, 10);
  const serverId = searchParams.get('serverId') ?? undefined;

  const result = await fetchThemes(year, serverId);

  return NextResponse.json({ slides: result.themes });
}
