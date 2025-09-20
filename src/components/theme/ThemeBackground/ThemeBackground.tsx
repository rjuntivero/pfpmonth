'use client';

import Image from 'next/image';
import styles from './ThemeBackground.module.css';
import { motion, useScroll, useTransform } from 'motion/react';

interface ThemeProps {
  themeImage?: string;
  wrapperClassName?: string;
  imageClassName?: string;
  style?: React.CSSProperties;
}

export default function ThemeBackground({ themeImage, wrapperClassName = '', imageClassName = '', style = {} }: ThemeProps) {
  const safeThemeImage = themeImage ?? '/no-image-placeholder.jpg';
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 155]);

  return (
    <div className={`${wrapperClassName}  ${styles.fadeInZoom}`} style={{ ...style, overflow: 'hidden' }}>
      <motion.div style={{ y, position: 'absolute', inset: 0 }}>
        <Image src={safeThemeImage} alt="Background" fill priority className={imageClassName} />
      </motion.div>
    </div>
  );
}
