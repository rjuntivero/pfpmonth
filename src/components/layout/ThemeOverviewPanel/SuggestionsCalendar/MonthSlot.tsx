'use client';
import { useDroppable } from '@dnd-kit/core';
import styles from './SuggestionsCalendar.module.css';
import { MonthSlotType } from './SuggestionsCalendar';
import { CSSProperties } from 'react';

interface Props {
  month: MonthSlotType;
  activeSuggestion: string | null;
  onUnassign: (monthId: string) => void;
}

export default function MonthSlot({ month, activeSuggestion, onUnassign }: { month: MonthSlotType; activeSuggestion: string | null; onUnassign: (monthId: string) => void }) {
  const { isOver, setNodeRef } = useDroppable({ id: month.id, disabled: month.isDisabled || month.isPreassigned });
  const hasValidTheme = month.assignedThemeName && month.assignedThemeName !== 'No Theme';

  const bgStyle: CSSProperties & Record<string, string> = {
    '--bg-image': month.image ? `url(${month.image})` : '',
  };

  return (
    <div
      ref={setNodeRef}
      className={`${styles.monthSlot} 
              ${isOver ? styles.over : ''} 
              ${month.isDisabled ? styles.disabled : ''} 
              ${hasValidTheme ? styles.filled : ''}`}
      style={{ '--bg-image': `url(${month.image ?? '/no-image-placeholder.jpg'})` } as React.CSSProperties & Record<string, string>}
    >
      <div className={styles.overlay}>
        {hasValidTheme ? (
          <>
            <p>{month.assignedThemeName}</p>
            {!month.isPreassigned && !month.isDisabled && month.assignedTheme && (
              <button className={styles.unassignBtn} onClick={() => onUnassign(month.id)}>
                ×
              </button>
            )}
          </>
        ) : (
          <p>{month.month}</p>
        )}
      </div>
    </div>
  );
}
