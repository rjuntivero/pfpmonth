import { NextResponse } from 'next/server';
import { fetchThemesAndServer } from '@/lib/fetchThemes';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get('year') ?? `${new Date().getFullYear()}`, 10);
  //   console.log('FETCHING DATA...');

  const result = await fetchThemesAndServer(year);
  //   console.log(`THE FETCHED THEMES OF ${year} ARE: ${JSON.stringify(result, null, 2)}`);
  return NextResponse.json({ slides: result.themes });
}
