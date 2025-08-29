'use client';
import { useDraggable } from '@dnd-kit/core';
import styles from './SuggestionsCalendar.module.css';
import Image from 'next/image';
import { PollOption } from '@/lib/api/poll/fetchPollOptions';

interface Props {
  suggestion: PollOption;
  setActiveSuggestion: (id: string | null) => void;
}

export default function DraggableSuggestion({ suggestion, setActiveSuggestion }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: suggestion.id,
    data: { id: suggestion.id },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={styles.suggestionCard} onMouseDown={() => setActiveSuggestion(suggestion.id)} onMouseUp={() => setActiveSuggestion(null)}>
      <div className={styles.suggestionImageWrapper}>{suggestion.image_url && <Image src={suggestion.image_url} alt={suggestion.name} fill className={styles.suggestionImage} />}</div>
      <div className={styles.suggestionNameOverlay}>
        <p>{suggestion.name}</p>
      </div>
    </div>
  );
}
