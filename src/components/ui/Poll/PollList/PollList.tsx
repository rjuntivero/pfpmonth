'use client';

import { useEffect, useState } from 'react';
import { UIPoll as PollType } from '@/types/Polls';
import Poll from '../Poll';

export default function PollList({ pollId }: { pollId: string }) {
  const [polls, setPolls] = useState<PollType[]>([]);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchPolls() {
      const res = await fetch(`/api/polls/options?pollId=${pollId}`);
      const data = await res.json();
      const sorted = (data.pollThemes || []).sort((a: PollType, b: PollType) => {
        if (b.vote_count !== a.vote_count) return b.vote_count - a.vote_count;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setPolls(sorted);
      setPolls(sorted);
    }
    fetchPolls();
  }, [pollId, refreshKey]);

  function forceRefresh() {
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <>
      {polls.map((poll) => (
        <Poll key={poll.id} poll_id={pollId} type="theme" poll={poll} />
      ))}
      <Poll type="upload" poll_id={pollId} onUploadSuccess={forceRefresh} />
    </>
  );
}
