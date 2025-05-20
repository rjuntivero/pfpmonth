import { createClient } from '@/utils/supabaseSSR';
import { NextRequest, NextResponse } from 'next/server';
import { fetchPollThemes } from '@/lib/fetchPollThemes';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const pollId = req.nextUrl.searchParams.get('pollId');

  if (!pollId) {
    return NextResponse.json({ error: 'Missing pollId' }, { status: 400 });
  }

  const { pollThemes } = await fetchPollThemes({ pollId });
  return NextResponse.json({ pollThemes });
}
