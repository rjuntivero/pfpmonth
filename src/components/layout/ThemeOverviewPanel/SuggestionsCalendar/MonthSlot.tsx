'use client';
import { useDroppable } from '@dnd-kit/core';
import styles from './SuggestionsCalendar.module.css';
import { MonthSlotType } from './SuggestionsCalendar';

interface Props {
  month: MonthSlotType;
  onUnassign: (monthId: string) => void;
}

export default function MonthSlot({ month, onUnassign }: Props) {
  const { isOver, setNodeRef } = useDroppable({ id: month.id, disabled: month.isDisabled || month.isPreassigned });
  const hasValidTheme = month.assignedThemeName && month.assignedThemeName !== 'No Theme';

  return (
    <div
      ref={setNodeRef}
      className={`${styles.monthSlot} 
              ${isOver ? styles.over : ''} 
              ${month.isDisabled ? styles.disabled : ''} 
              ${hasValidTheme ? styles.filled : ''}`}
      style={{ '--bg-image': `url(${month.image ?? '/no-image-placeholder.jpg'})` } as React.CSSProperties & Record<string, string>}
    >
      {hasValidTheme ? (
        <>
          <p className={styles.monthName}>{month.month}</p>
          <p className={styles.themeName}>{month.assignedThemeName}</p>
          {!month.isPreassigned && !month.isDisabled && month.assignedTheme && (
            <button className={styles.unassignBtn} onClick={() => onUnassign(month.id)}>
              ×
            </button>
          )}
        </>
      ) : (
        <p className={styles.monthName}>{month.month}</p>
      )}
    </div>
  );
}
