'use client';

import { useEffect, useState } from 'react';
import { Poll as PollType } from '@/types/Polls';
import Poll from '../Poll';

export default function PollList({ poll }: { poll: PollType }) {
  const [polls, setPolls] = useState<PollType[]>([]);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchPolls() {
      const res = await fetch(`/api/polls/options?pollId=${poll.id}`);
      console.log('DATA: ', res);
      const data = await res.json();

      const sorted = (data.pollThemes || []).sort((a: PollType, b: PollType) => {
        const aVotes = a.vote_count ?? 0;
        const bVotes = b.vote_count ?? 0;

        if (bVotes !== aVotes) return bVotes - aVotes;

        const aTime = new Date(a.created_at ?? '').getTime();
        const bTime = new Date(b.created_at ?? '').getTime();

        return bTime - aTime;
      });

      setPolls(sorted);
      setPolls(sorted);
      console.log('FETCHED POLLS: ', polls);
    }
    console.log('FETCHED DONE POLLS: ', polls);

    fetchPolls();
    //eslint-disable-next-line
  }, [poll.id, refreshKey]);

  function forceRefresh() {
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <>
      {polls.map((poll) => (
        <Poll key={poll?.id} poll={poll} type="theme" />
      ))}
      <Poll type="upload" poll={poll} onUploadSuccess={forceRefresh} />
    </>
  );
}
