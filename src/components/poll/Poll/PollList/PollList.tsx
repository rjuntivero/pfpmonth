'use client';

import { useEffect, useState } from 'react';
import PollOption from '../PollOption';
import { PollOption as PollType } from '@/lib/api/poll/fetchPollOptions';
import { useAppSelector } from '@/state/hooks';
import { setPollOptions } from '@/features/pollSlice';
import { useDispatch } from 'react-redux';
import { ServerPoll } from '@/lib/api/poll/fetchServerPoll';

interface Props {
  serverPoll: ServerPoll;
}

export default function PollList({ serverPoll }: Props) {
  const pollOptions = useAppSelector((state) => state.poll.pollOptions);
  const dispatch = useDispatch();
  const [refreshKey, setRefreshKey] = useState(0);

  // fetch server polls on poll update
  useEffect(() => {
    async function fetchPolls() {
      const res = await fetch(`/api/polls/${serverPoll.id}`);
      const data = await res.json();

      const sorted = (data.pollOptions || []).sort((a: PollType, b: PollType) => {
        const aVotes = a.vote_count ?? 0;
        const bVotes = b.vote_count ?? 0;

        if (bVotes !== aVotes) return bVotes - aVotes;

        const aTime = new Date(a.created_at ?? '').getTime();
        const bTime = new Date(b.created_at ?? '').getTime();

        return bTime - aTime;
      });

      dispatch(setPollOptions(sorted));
    }

    fetchPolls();
  }, [serverPoll?.id, refreshKey, dispatch]);

  // refresh page when poll is updated
  function forceRefresh() {
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <>
      {pollOptions.map((option) => (
        <PollOption poll={serverPoll} key={option?.id} option={option} type="theme" />
      ))}
      <PollOption poll={serverPoll} type="upload" refetchThemes={forceRefresh} />
    </>
  );
}
