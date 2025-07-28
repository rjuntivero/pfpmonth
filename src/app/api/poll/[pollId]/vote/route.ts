// import { createClient } from '@/lib/supabase/supabaseSSR';
import { NextResponse } from 'next/server';
import { updatePollOptionVote } from '@/lib/api/poll/pollActions';

export async function POST(req: Request, { params }: { params: { pollId: string } }) {
  const { pollId } = await params;
  const { userId } = await req.json();

  // fetch poll data
  const res = await updatePollOptionVote(pollId, userId);

  if (!res) {
    return NextResponse.json({ error: 'Failed to update vote' }, { status: 500 });
  }

  // Return the vote result to the client
  return NextResponse.json(res);
}
