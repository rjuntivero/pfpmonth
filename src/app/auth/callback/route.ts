import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabaseSSR';
import { updateSupabaseTables } from '@/utils/dbUserData';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';
  const data = searchParams.get('data');
  let metadata: {
    discord_id?: string;
    server_id?: string;
    server_name?: string;
    server_icon?: string;
  } = {};
  try {
    metadata = JSON.parse(decodeURIComponent(data ?? '{}'));
  } catch (e) {
    console.error('Failed to parse data param:', e);
  }

  const { discord_id, server_id, server_name, server_icon } = metadata;
  console.log('DISCORD ID: ', discord_id);
  console.log('SERVER ID: ', server_id);
  console.log('SERVER NAME: ', server_name);
  console.log('SERVER ICON: ', server_icon);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await updateSupabaseTables(supabase, user, metadata);
      }
      const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
