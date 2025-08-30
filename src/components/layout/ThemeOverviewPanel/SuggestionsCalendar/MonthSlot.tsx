'use client';
import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import styles from './SuggestionsCalendar.module.css';
import { MonthSlotType } from './SuggestionsCalendar';

interface Props {
  month: MonthSlotType;
  onUnassign: (monthId: string) => void;
}

export default function MonthSlot({ month, onUnassign }: Props) {
  const { isOver, setNodeRef } = useDroppable({ id: month.id, disabled: month.isDisabled || month.isPreassigned });
  const hasValidTheme = month.assignedThemeName && month.assignedThemeName !== 'No Theme';

  // animation for unfilled slots
  const pulseAnimation = {
    scale: [1, 1.03, 1], // gentle "breathing"
    opacity: [1, 0.8, 1],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  return (
    <motion.div
      ref={setNodeRef}
      className={`${styles.monthSlot} 
              ${isOver ? styles.over : ''} 
              ${month.isDisabled ? styles.disabled : ''} 
              ${hasValidTheme ? styles.filled : ''}`}
      style={{ '--bg-image': `url(${month.image ?? '/no-image-placeholder.jpg'})` } as React.CSSProperties & Record<string, string>}
      initial={{ scale: 1, opacity: 1 }}
      animate={!hasValidTheme ? { scale: [1, 1.015, 1], opacity: [1, 0.8, 1] } : {}}
      transition={!hasValidTheme ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : {}}
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
    </motion.div>
  );
}
