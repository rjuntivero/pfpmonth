'use client';
import { useDraggable } from '@dnd-kit/core';
import styles from './SuggestionsCalendar.module.css';
import Image from 'next/image';
import { PollOption } from '@/lib/api/poll/fetchPollOptions';
import TooltipPortal from '@/components/shared/TooltipPortal/TooltipPortal';
import { useTooltip } from '@/hooks/useTooltip';
import SuggestionDetails from './SuggestionDetails';
import { useState } from 'react';

interface Props {
  suggestion: PollOption;
  setActiveSuggestion: (id: string | null) => void;
}
export default function DraggableSuggestion({ suggestion, setActiveSuggestion }: Props) {
  const { tooltip, handleMouseEnter, handleMouseMove, handleMouseLeave, handleTouchStart, handleTouchMove, handleTouchEnd } = useTooltip();
  const [showTooltip, setShowTooltip] = useState(false);

  // always call the hook
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: suggestion.id,
    data: { id: suggestion.id },
  });

  const style = {
    opacity: isDragging ? 0 : 1,
  };

  const tooltipContent = <SuggestionDetails themeCreator={suggestion.created_by} themeName={suggestion.name} themeVotes={suggestion.vote_count ?? 0} themeDescription={suggestion.description} />;

  return (
    <>
      <div
        onMouseEnter={(e) => handleMouseEnter(e, tooltipContent)}
        onMouseMove={(e) => handleMouseMove(e, tooltipContent)}
        onMouseLeave={handleMouseLeave}
        onTouchStart={(e) => handleTouchStart(e, tooltipContent)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={styles.suggestionCard}
        onMouseDown={() => setActiveSuggestion(suggestion.id)}
        onMouseUp={() => setActiveSuggestion(null)}
      >
        <div className={styles.suggestionImageWrapper}>{suggestion.image_url && <Image src={suggestion.image_url} alt={suggestion.name} fill className={styles.suggestionImage} />}</div>
        <div className={styles.suggestionNameOverlay}>
          <p>{suggestion.name}</p>
        </div>
      </div>

      {tooltip && <TooltipPortal position={{ x: tooltip.x, y: tooltip.y }}>{tooltip.content}</TooltipPortal>}
    </>
  );
}
