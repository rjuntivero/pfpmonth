import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/utils/supabase';
import { redirect } from 'next/navigation';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const discord_id = searchParams.get('discord_id')?.trim();
  const token = searchParams.get('token')?.trim();

  if (!discord_id || !token) {
    redirect('/error?reason=missing');
  }

  const verified = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/magic-login/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ discord_id, token }),
    cache: 'no-store',
  });

  if (!verified.ok) {
    redirect('/error?reason=invalid');
  }

  type ServerJoinResult = {
    server_id: string;
    servers: {
      name: string;
      icon_url: string;
    };
  };

  // Fetch user/server info for setting cookies
  const { data: user } = await supabase.from('users').select('*').eq('discord_id', discord_id).single();
  const { data: server } = await supabase.from('user_servers').select('server_id, servers(name, icon_url)').eq('discord_id', discord_id).single<ServerJoinResult>();

  const res = NextResponse.redirect(new URL('/', req.url));

  res.cookies.set('discord_id', discord_id);
  res.cookies.set('username', user?.username ?? '');
  res.cookies.set('avatar_icon', user?.avatar_url ?? '');
  res.cookies.set('server_name', server?.servers?.name ?? '');
  res.cookies.set('server_icon', server?.servers?.icon_url ?? '');
  console.log('DISCORD ID:', discord_id);
  console.log('User:', user);
  console.log('Joined server row:', server);
  console.log('Server name:', server?.servers?.name);
  console.log('Server icon:', server?.servers?.icon_url);

  return res;
}

export async function POST(request: Request) {
  const { discord_id, token, username, avatar_url, server_id, server_name, server_icon } = await request.json();

  if (!discord_id || !token || !username || !server_id) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  // store user if not exists
  const { data: user } = await supabase.from('users').select('*').eq('discord_id', discord_id).single();
  if (!user) {
    await supabase.from('users').insert([{ discord_id, username, avatar_url }]);
  }

  // store server if not exists
  const { data: server } = await supabase.from('servers').select('*').eq('id', server_id).single();
  if (!server) {
    await supabase.from('servers').insert([{ id: server_id, name: server_name, icon_url: server_icon }]);
  }

  // link user to server
  await supabase.from('user_servers').insert([{ discord_id, server_id }]);

  return NextResponse.json({ success: true });
}
