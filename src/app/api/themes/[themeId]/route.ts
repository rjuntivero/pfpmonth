import { createClient } from '@/lib/supabase/supabaseSSR';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, { params }: { params: { themeId: string } }) {
  const { themeId } = params;

  if (!themeId) {
    return NextResponse.json({ error: 'Missing themeId' }, { status: 400 });
  }

  const supabase = await createClient();

  const { error } = await supabase.from('themes').delete().eq('id', themeId).select();
  if (error) {
    console.log('Error deleting theme:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
