import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabaseSSR';
import { updateSupabaseTables } from '@/lib/dbUserData';

type Metadata = {
  discord_id?: string;
  server_id?: string;
  server_name?: string;
  server_icon?: string;
};

function setCookies(response: NextResponse, { server_id, server_name, server_icon }: Metadata) {
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  response.cookies.set('server_id', server_id ?? '', {
    path: '/',
    maxAge,
    sameSite: 'lax',
  });
  response.cookies.set('server_name', server_name ?? '', {
    path: '/',
    maxAge,
    sameSite: 'lax',
  });
  response.cookies.set('server_icon', server_icon ?? '', {
    path: '/',
    maxAge,
    sameSite: 'lax',
  });
  return response;
}

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
        const redirectUrl = `${origin}${next}`;
        const response = NextResponse.redirect(redirectUrl);

        // set cookies
        setCookies(response, metadata);

        return response;
      } else if (forwardedHost) {
        const redirectUrl = `https://${forwardedHost}${next}`;
        const response = NextResponse.redirect(redirectUrl);
        // set cookies
        setCookies(response, metadata);
        return response;
      } else {
        const redirectUrl = `${origin}${next}`;
        const response = NextResponse.redirect(redirectUrl);
        // set cookies
        setCookies(response, metadata);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
