import { NextResponse } from 'next/server';
import { fetchThemes } from '@/lib/api/theme/fetchThemes';
import { createClient } from '@/lib/supabase/supabaseSSR';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get('year') ?? `${new Date().getFullYear()}`, 10);

  const result = await fetchThemes(year);
  return NextResponse.json({ slides: result.themes });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const themeId = searchParams.get('themeId');

  if (!themeId) {
    return NextResponse.json({ error: 'Missing themeId' }, { status: 400 });
  }

  const supabase = await createClient();

  const { error } = await supabase.from('themes').delete().eq('id', themeId).select();
  if (error) {
    console.log('Error deleting theme:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
