'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './ThemeBackground.module.css';

interface ThemeProps {
  themeId?: string;
  wrapperClassName?: string;
  imageClassName?: string;
  style?: React.CSSProperties;
}

export default function ThemeBackground({ themeId, wrapperClassName = '', imageClassName = '', style }: ThemeProps) {
  const backgroundImage = `/${themeId}.jpg`;

  return (
    <motion.div
      initial={{ scale: 1, opacity: 0.5, filter: 'blur(12px)', y: 0 }}
      animate={{ scale: 1.05, opacity: 1, filter: 'blur(0px)', y: '2.25%' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`${styles.bgWrapper} ${wrapperClassName}`}
      style={style}
    >
      <Image src={backgroundImage} alt="Background" fill priority className={`${styles.bgImage} ${imageClassName}`} />
    </motion.div>
  );
}
