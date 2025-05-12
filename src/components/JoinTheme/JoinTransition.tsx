'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './JoinTransition.module.css';

export default function JoinTransition({ trigger, imageUrl, onComplete }: { trigger: boolean; imageUrl: string; onComplete: () => void }) {
  const router = useRouter();

  useEffect(() => {
    if (trigger) {
      const timeout = setTimeout(() => {
        onComplete();
        router.push('/upload');
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [trigger, router, onComplete]);

  return (
    <AnimatePresence>
      {trigger && (
        <>
          <motion.div className={styles.swipe} initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.3, ease: 'easeInOut' }} />
          <motion.div
            className={styles.bgZoom}
            style={{ backgroundImage: `url(${imageUrl})` }}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 0.2, top: '85%', left: '75%' }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.3, ease: 'easeInOut' }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
