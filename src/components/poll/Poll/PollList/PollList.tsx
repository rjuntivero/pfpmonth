'use client';

import { useEffect, useState } from 'react';
import PollOption from '../PollOption';
import { PollOption as PollType } from '@/lib/api/poll/fetchPollOptions';
import { useAppSelector } from '@/state/hooks';
import { setSuggestions } from '@/features/pollSlice';
import { useDispatch } from 'react-redux';

interface Props {
  poll: PollType;
}

export default function PollList({ poll }: Props) {
  const suggestions = useAppSelector((state) => state.poll.suggestions);
  const dispatch = useDispatch();
  const [refreshKey, setRefreshKey] = useState(0);

  // fetch server polls on poll update
  useEffect(() => {
    async function fetchPolls() {
      const res = await fetch(`/api/polls/options?pollId=${poll.id}`);
      const data = await res.json();

      const sorted = (data.pollOptions || []).sort((a: PollType, b: PollType) => {
        const aVotes = a.vote_count ?? 0;
        const bVotes = b.vote_count ?? 0;

        if (bVotes !== aVotes) return bVotes - aVotes;

        const aTime = new Date(a.created_at ?? '').getTime();
        const bTime = new Date(b.created_at ?? '').getTime();

        return bTime - aTime;
      });

      dispatch(setSuggestions(sorted));
    }

    fetchPolls();
  }, [poll?.id, refreshKey, dispatch]);

  // refresh page when poll is updated
  function forceRefresh() {
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <>
      {suggestions.map((suggestion) => (
        <PollOption key={suggestion?.id} poll={suggestion} type="theme" />
      ))}
      <PollOption type="upload" poll={poll} refetchThemes={forceRefresh} />
    </>
  );
}
