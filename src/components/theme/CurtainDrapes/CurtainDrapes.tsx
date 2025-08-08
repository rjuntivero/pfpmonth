'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './CurtainDrapes.module.css';
import { useAppSelector } from '@/state/hooks';

export function CurtainDrapes() {
  // eslint-disable-next-line
  const [open, setOpen] = useState(false);
  const themesLoaded = useAppSelector((state) => state.theme.loaded);

  useEffect(() => {
    if (themesLoaded) {
      const timer = setTimeout(() => setOpen(true), 150);
      return () => clearTimeout(timer);
    }
  }, [themesLoaded]);

  return (
    <div className={styles.drapesContainer}>
      <motion.div className={`${styles.drape} ${styles.left}`} initial={{ x: 0 }} animate={open ? { x: '-80%' } : { x: 0 }} transition={{ duration: 1.5, ease: [0.75, 0, 0.15, 1] }} />
      <motion.div className={`${styles.drape} ${styles.right}`} initial={{ x: 0 }} animate={open ? { x: '80%' } : { x: 0 }} transition={{ duration: 1.5, ease: [0.75, 0, 0.15, 1] }} />
    </div>
  );
}
