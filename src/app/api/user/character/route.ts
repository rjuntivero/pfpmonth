import { fetchServer } from '@/lib/api/server/fetchServer';
import { createClient } from '@/lib/supabase/supabaseSSR';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'No user session found' }, { status: 401 });
  }

  const server = await fetchServer();
  const server_id = server?.server_id;
  const body = await req.json();
  const { characterName, theme_id } = body;

  // upsert chosen character for user
  const { error: characterError } = await supabase.from('user_characters').upsert(
    [
      {
        name: characterName,
        theme_id,
        user_id: user.id,
      },
    ],
    {
      onConflict: 'user_id,theme_id',
    }
  );

  if (characterError) {
    console.error('Upsert error:', characterError);
    return NextResponse.json({ success: false, characterError }, { status: 500 });
  }

  // update user streak automatically
  const { error: streakError } = await supabase.rpc('update_user_streak', {
    p_user_id: user.id,
    p_server_id: server_id,
    p_theme_month: new Date().toISOString().slice(0, 10),
  });

  if (streakError) {
    console.error('RPC error:', streakError);
    return NextResponse.json({ success: false, streakError }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
