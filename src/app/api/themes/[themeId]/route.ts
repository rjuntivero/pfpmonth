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

export async function POST(req: Request, { params }: { params: { themeId: string } }) {
  const { themeId } = params;

  const body = await req.json();
  const { name, description, image_url, server_id, created_by, theme_month } = body;

  if (!themeId || !name || !server_id || !created_by || !theme_month) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const supabase = await createClient();

  // insert poll option entry into themes table
  const { error: insertError } = await supabase.from('themes').insert({
    name,
    description,
    image_url,
    server_id,
    created_by,
    theme_month,
    created_at: new Date().toISOString(),
  });

  if (insertError) {
    console.log('Error deleting theme:', insertError);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // delete poll option entry
  const { error: deleteError } = await supabase.from('poll_options').delete().eq('id', themeId);
  if (deleteError) {
    console.warn('Inserted theme, but failed to delete poll_option:', deleteError);
  }
  return NextResponse.json({ success: true });
}
