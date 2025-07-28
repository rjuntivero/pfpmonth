'use client';

import { useEffect, useState } from 'react';
import { Poll as PollType } from '@/types/Polls';
import PollOption from '../PollOption';

export default function PollList({ poll }: { poll: PollType }) {
  const [pollOptions, setPollOptions] = useState<PollType[]>([]);

  const [refreshKey, setRefreshKey] = useState(0);

  // fetch server polls on mount and on poll update
  useEffect(() => {
    async function fetchPolls() {
      const res = await fetch(`/api/polls/options?pollId=${poll.id}`);
      const data = await res.json();
      console.log('Fetched poll options:', data.pollOptions);

      const sorted = (data.pollOptions || []).sort((a: PollType, b: PollType) => {
        const aVotes = a.vote_count ?? 0;
        const bVotes = b.vote_count ?? 0;

        if (bVotes !== aVotes) return bVotes - aVotes;

        const aTime = new Date(a.created_at ?? '').getTime();
        const bTime = new Date(b.created_at ?? '').getTime();

        return bTime - aTime;
      });

      setPollOptions(sorted);
      setPollOptions(sorted);
    }

    fetchPolls();
    //eslint-disable-next-line
  }, [poll.id, refreshKey]);

  // refresh page when poll is updated
  function forceRefresh() {
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <>
      {pollOptions.map((option) => (
        <PollOption key={option?.id} poll={option} type="theme" />
      ))}
      <PollOption type="upload" poll={poll} refetchThemes={forceRefresh} />
    </>
  );
}
