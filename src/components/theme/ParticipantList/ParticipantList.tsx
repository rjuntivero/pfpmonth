'use client';

import { useEffect, useState } from 'react';
import User from '@/components/user/User';
import { createClient } from '@/lib/supabase/supabase';
import { Participant } from '@/types/Participant';
import { fetchParticipants } from '@/lib/api/theme/fetchParticipants';

interface Props {
  themeId: string;
}

export default function ParticipantList({ themeId }: Props) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (!themeId) return;

    // Initial fetch
    const loadParticipants = async () => {
      const data = await fetchParticipants(themeId);
      setParticipants(data);
    };

    loadParticipants();

    // Realtime subscription
    const channel = supabase
      .channel(`participants:${themeId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_characters',
          filter: `theme_id=eq.${themeId}`,
        },
        (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload;

          setParticipants((prev) => {
            if (eventType === 'INSERT') return [...prev, newRow as Participant];
            if (eventType === 'UPDATE')
              return prev.map((p) =>
                p.id === (newRow as Participant).id ? (newRow as Participant) : p
              );
            if (eventType === 'DELETE')
              return prev.filter((p) => p.id !== (oldRow as Participant).id);

            return prev;
          });
        }
      )
      .subscribe();

    // Cleanup
    return () => supabase.removeChannel(channel);
  }, [themeId, supabase]);

  if (!participants.length) return <p>No participants yet</p>;

  return (
    <div className="users">
      {participants.map((p, i) => (
        <User key={`${p.users.username}-${i}`} participant={p} />
      ))}
    </div>
  );
}
