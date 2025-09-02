// import { createClient } from '@/lib/supabase/supabaseSSR';
import { NextResponse } from 'next/server';
import { updatePollOptionVote } from '@/lib/api/poll/pollActions';
import { getPollOptionVoteCount } from '@/lib/api/poll/pollActions';

interface Props {
  optionId: string;
}

// update vote count for a poll option
export async function POST(req: Request, { params }: { params: Promise<Props> }) {
  const { optionId } = await params;
  const { userId } = await req.json();

  // fetch poll data
  const res = await updatePollOptionVote(optionId, userId);

  if (!res) {
    return NextResponse.json({ error: 'Failed to update vote' }, { status: 500 });
  }

  // Return the vote result to the client
  return NextResponse.json(res);
}

// get vote count for a poll option
export async function GET(req: Request, { params }: { params: Promise<Props> }) {
  const { optionId } = await params;
  const voteCount = await getPollOptionVoteCount(optionId as string);
  return NextResponse.json({ voteCount });
}
