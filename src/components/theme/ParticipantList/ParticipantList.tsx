'use client';

import User from '@/components/user/User';
import { useAppSelector } from '@/state/hooks';

export default function ParticipantList() {
  const participants = useAppSelector((state) => state.character.participants);
  const chosenCharacters = useAppSelector((state) => state.character.chosenCharacter);

  if (participants.length === 0) return <p>No participants yet</p>;

  const mergedParticipants = participants.map((p) => ({
    ...p,
    name: chosenCharacters[p.theme_id]?.name || p.character_name,
    image_url: chosenCharacters[p.theme_id]?.image_url || p.image_url,
  }));

  return (
    <div className="users">
      {mergedParticipants.map((p, i) => (
        <User key={`${p.username}-${i}`} participant={p} />
      ))}
    </div>
  );
}
