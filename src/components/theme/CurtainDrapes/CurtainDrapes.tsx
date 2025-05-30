'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './CurtainDrapes.module.css';

export function CurtainDrapes() {
  // eslint-disable-next-line
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.drapesContainer}>
      <motion.div className={`${styles.drape} ${styles.left}`} initial={{ x: 0 }} animate={{ x: '-80%' }} transition={{ duration: 1.5, ease: [0.75, 0, 0.15, 1] }} />
      <motion.div className={`${styles.drape} ${styles.right}`} initial={{ x: 0 }} animate={{ x: '80%' }} transition={{ duration: 1.5, ease: [0.75, 0, 0.15, 1] }} />
    </div>
  );
}
