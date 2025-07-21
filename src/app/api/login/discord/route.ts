import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/supabaseSSR';
import { redirect } from 'next/navigation';

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const searchParams = new URL(req.url).searchParams;
  const discord_id = searchParams.get('discord_id');
  const server_id = searchParams.get('server_id');
  const server_name = searchParams.get('server_name');
  const server_icon = searchParams.get('server_icon');

  if (!discord_id || !server_id || !server_name || !server_icon) {
    return NextResponse.redirect(new URL('/error?reason=missing', req.url));
  }

  const payload = encodeURIComponent(JSON.stringify({ discord_id, server_id, server_name, server_icon }));

  const redirectTo = `http://localhost:8080/auth/callback?data=${payload}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: redirectTo,
    },
  });

  if (error) {
    console.error('[OAuth Error] ❌', error.message);
  }

  if (data?.url) {
    redirect(data.url);
  }

  return NextResponse.redirect(new URL('/error?reason=oauth_init', req.url));
}
