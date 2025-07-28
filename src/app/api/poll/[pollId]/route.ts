import { getPollOptionVoteCount } from '@/lib/api/poll/pollActions';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { pollId: string } }) {
  const { pollId } = await params;
  const voteCount = await getPollOptionVoteCount(pollId as string);
  return NextResponse.json({ voteCount });
}
