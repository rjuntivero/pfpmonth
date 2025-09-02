import { NextResponse } from 'next/server';
import { fetchThemeData } from '@/lib/api/theme/fetchThemeData';
import { createTheme } from '@/lib/api/theme/themeActions';

interface Props {
  characterId: string;
}

// fetch theme data by characterId
export async function GET(req: Request, { params }: { params: Promise<Props> }) {
  const { characterId } = await params;
  const theme = await fetchThemeData({ characterId: characterId ?? undefined });

  return NextResponse.json(theme);
}
