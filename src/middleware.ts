// middleware.ts
import { createClient } from '@/lib/supabase/supabaseSSR';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protect these paths
export const config = {
  matcher: ['/themes/:path*', '/profile/:path*', '/leaderboard/:path*'],
};

export default async function middleware(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.log('USER FOUND');
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.search = `?from=${encodeURIComponent(req.nextUrl.pathname)}`;
    return NextResponse.redirect(url);
  }

  console.log('USER ???');

  return NextResponse.next();
}
