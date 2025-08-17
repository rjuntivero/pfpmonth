import { NextResponse } from 'next/server';
import { fetchThemeData } from '@/lib/api/theme/fetchThemeData';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const characterId = url.searchParams.get('characterId');
  const theme = await fetchThemeData({ characterId: characterId ?? undefined });
  console.log(`Fetched theme data for character: ${characterId}`, theme);
  return NextResponse.json(theme);
}
