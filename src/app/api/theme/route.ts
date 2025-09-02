import { NextResponse } from 'next/server';
import { fetchThemeData } from '@/lib/api/theme/fetchThemeData';

// fetch theme data by characterId
export async function GET(req: Request) {
  const url = new URL(req.url);
  const characterId = url.searchParams.get('characterId');
  const theme = await fetchThemeData({ characterId: characterId ?? undefined });

  return NextResponse.json(theme);
}
