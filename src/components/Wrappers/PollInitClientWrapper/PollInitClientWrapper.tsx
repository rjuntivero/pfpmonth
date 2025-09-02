'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPollOptions } from '@/features/pollSlice';
import { useAppSelector } from '@/state/hooks';
import { PollOption } from '@/lib/api/poll/fetchPollOptions';

interface Props {
  polls?: PollOption[];
}
export default function PollInitClientWrapper({ polls }: Props) {
  const dispatch = useDispatch();
  const pollOptions = useAppSelector((state) => state.poll.pollOptions);

  useEffect(() => {
    const sorted = [...(polls || [])].sort((a: PollOption, b: PollOption) => {
      const aVotes = a.vote_count ?? 0;
      const bVotes = b.vote_count ?? 0;

      if (bVotes !== aVotes) return bVotes - aVotes;

      const aTime = new Date(a.created_at ?? '').getTime();
      const bTime = new Date(b.created_at ?? '').getTime();

      return bTime - aTime;
    });
    dispatch(setPollOptions(sorted));
  }, [dispatch, polls]);
  return null;
}
