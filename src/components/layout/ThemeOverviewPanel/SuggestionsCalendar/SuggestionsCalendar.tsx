'use client';
import { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import styles from './SuggestionsCalendar.module.css';
import MonthSlot from './MonthSlot';
import DraggableSuggestion from './DraggableSuggestion';

interface MonthSlotType {
  id: string;
  month: string;
  assignedSuggestion?: SuggestionType;
  assignedTheme?: string | undefined;
  assignedThemeName: string | undefined;
  isDisabled?: boolean;
  isPreassigned?: boolean;
  image?: string;
}

interface SuggestionType {
  id: string;
  name: string;
  image?: string;
}

interface Props {
  months: MonthSlotType[];
  suggestions: SuggestionType[];
  onAssign: (monthId: string | number, suggestionId: string) => void;
  onUnassign: (monthId: string) => void;
}

export default function SuggestionsCalendar({ months, suggestions, onAssign, onUnassign }: Props) {
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.data.current) {
      onAssign(over.id, active.data.current.id);
    }
    setActiveSuggestion(null);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className={styles.container}>
        <div className={styles.calendar}>
          {months.map((month) => (
            <MonthSlot key={month.id} month={month} activeSuggestion={activeSuggestion} onUnassign={onUnassign} />
          ))}
        </div>
        <div className={styles.suggestions}>
          {suggestions.map((s) => (
            <DraggableSuggestion key={s.id} suggestion={s} setActiveSuggestion={setActiveSuggestion} />
          ))}
        </div>
      </div>
    </DndContext>
  );
}

export type { MonthSlotType, SuggestionType };
