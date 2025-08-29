'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSuggestions } from '@/features/pollSlice';
import { useAppSelector } from '@/state/hooks';
import { PollOption } from '@/lib/api/poll/fetchPollOptions';

interface Props {
  polls?: PollOption[];
}
export default function PollInitClientWrapper({ polls }: Props) {
  const dispatch = useDispatch();
  const suggestions = useAppSelector((state) => state.poll.suggestions);

  useEffect(() => {
    const sorted = [...(polls || [])].sort((a: PollOption, b: PollOption) => {
      const aVotes = a.vote_count ?? 0;
      const bVotes = b.vote_count ?? 0;

      if (bVotes !== aVotes) return bVotes - aVotes;

      const aTime = new Date(a.created_at ?? '').getTime();
      const bTime = new Date(b.created_at ?? '').getTime();

      return bTime - aTime;
    });
    dispatch(setSuggestions(sorted));
  }, [dispatch, polls]);
  console.log('SUGGESTIONS', suggestions);
  return null;
}
