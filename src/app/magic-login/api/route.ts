import { NextResponse } from 'next/server';
import supabase from '@/utils/supabase';

export async function POST(request: Request) {
  const { discord_id, token, username, avatar_url, server_id, server_name, server_icon } = await request.json();

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
  // check if server exists
  const { data: server } = await supabase.from('servers').select('*').eq('id', server_id).single();

  if (!user) {
    // create new user
    await supabase.from('users').insert([{ discord_id: discord_id, username: username, avatar_url: avatar_url }]);
  }
  if (!server) {
    // insert new server
    await supabase.from('servers').insert([{ id: server_id, name: server_name, icon_url: server_icon }]);
  }

  return NextResponse.json({ success: true });
}
