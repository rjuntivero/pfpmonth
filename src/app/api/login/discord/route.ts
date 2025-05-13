import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabaseSSR';
import { redirect } from 'next/navigation';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const searchParams = new URL(req.url).searchParams;
  const discord_id = searchParams.get('discord_id');
  const server_id = searchParams.get('server_id');

  if (!discord_id || !server_id) {
    return NextResponse.redirect(new URL('/error?reason=missing', req.url));
  }

  const redirectTo = `http://localhost:8080/auth/callback/`;

  console.log('[Login Route] 🔁 redirectTo:', redirectTo);

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
