import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/utils/supabase';

export async function POST(req: NextRequest) {
  const { discord_id, server_id } = await req.json();

  const { data: user } = await supabase.from('users').select('*').eq('discord_id', discord_id).single();

  const { data: server } = await supabase.from('user_servers').select('servers(name, icon_url)').eq('discord_id', discord_id).eq('server_id', server_id).single();

  return NextResponse.json({
    username: user?.username ?? '',
    avatar_url: user?.avatar_url ?? '',
    server_name: server?.servers?.name ?? '',
    server_icon: server?.servers?.icon_url ?? '',
  });
}
