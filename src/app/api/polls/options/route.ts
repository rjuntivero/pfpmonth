import { createClient } from '@/lib/utils/supabaseSSR';
import { NextRequest, NextResponse } from 'next/server';
import { fetchPollThemes } from '@/lib/api/poll/fetchPollThemes';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const pollId = req.nextUrl.searchParams.get('pollId');

  console.log('POLL ID TO BE FETCHED: ', pollId);

  if (!pollId) {
    return NextResponse.json({ error: 'Missing pollId' }, { status: 400 });
  }

  const { pollThemes } = await fetchPollThemes({ pollId });
  console.log('POLL THEMES: ', pollThemes);

  return NextResponse.json({ pollThemes });
}
