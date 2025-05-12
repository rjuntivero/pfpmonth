import { NextResponse } from 'next/server';
import supabase from '@/utils/supabase';

export async function POST(request: Request) {
  const { discord_id, token } = await request.json();

  if (!discord_id || !token) {
    return NextResponse.json({ error: 'Missing token or user' }, { status: 400 });
  }

  const { data: tokenRow, error } = await supabase.from('magic_tokens').select('*').eq('discord_id', discord_id).eq('token', token).gte('expires_at', new Date().toISOString()).single();

  if (!tokenRow || error) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  // Delete token after use
  await supabase.from('magic_tokens').delete().eq('id', tokenRow.id);

  return NextResponse.json({ success: true });
}
