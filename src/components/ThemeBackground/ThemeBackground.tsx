'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './ThemeBackground.module.css';

interface ThemeProps {
  themeId: string;
}

export default function ThemeBackground({ themeId }: ThemeProps) {
  const backgroundImage = `/${themeId}.jpg`;

  return (
    <motion.div initial={{ scale: 1, opacity: 0.5, filter: 'blur(12px)' }} animate={{ scale: 1.05, opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 0.8, ease: 'easeOut' }} className={styles.bgWrapper}>
      <Image src={backgroundImage} alt="Background" fill priority className={styles.bgImage} />
    </motion.div>
  );
}
