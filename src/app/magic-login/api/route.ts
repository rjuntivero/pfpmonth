import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ROLE_KEY!);

export async function POST(request: Request) {
  const { discord_id, token } = await request.json();

  console.log(discord_id);
  console.log(token);

  if (!discord_id || !token) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  // verify Token
  const { data: tokenRow, error } = await supabase.from('magic_tokens').select('*').eq('discord_id', discord_id).eq('token', token).gte('expires_at', new Date().toISOString()).single();

  if (!tokenRow) {
    return NextResponse.json({ error: error }, { status: 400 });
  }

  // delete token
  await supabase.from('magic_tokens').delete().eq('id', tokenRow.id);

  // check if user exists
  const { data: user } = await supabase.from('users').select('*').eq('discord_id', discord_id).single();

  if (!user) {
    // create new user
    await supabase.from('users').insert([{ discord_id }]);
  }

  return NextResponse.json({ success: true });
}
