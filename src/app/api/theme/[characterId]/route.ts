import { NextResponse } from 'next/server';
import { fetchThemeDataCharacterID } from '@/lib/api/theme/fetchThemeDataCharacterId';

interface Props {
  characterId: string;
}

// fetch theme data by characterId
export async function GET(req: Request, { params }: { params: Promise<Props> }) {
  const { characterId } = await params;
  const theme = await fetchThemeDataCharacterID({ characterId: characterId ?? undefined });

  return NextResponse.json(theme);
}
