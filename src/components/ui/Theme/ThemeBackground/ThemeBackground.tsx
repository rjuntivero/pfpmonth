'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface ThemeProps {
  themeImage?: string;
  wrapperClassName?: string;
  imageClassName?: string;
  style?: React.CSSProperties;
}

export default function ThemeBackground({ themeImage, wrapperClassName = '', imageClassName = '', style }: ThemeProps) {
  const safeThemeImage = themeImage ? encodeURI(themeImage) : '/no-image-placeholder.jpg';
  console.log('THE THEME IMAGE IS ', themeImage);

  return (
    <motion.div initial={{ scale: 1, opacity: 0.5, filter: 'blur(12px)' }} animate={{ scale: 1.05, opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 0.8, ease: 'easeOut' }} className={`${wrapperClassName}`} style={style}>
      <Image src={safeThemeImage} alt="Background" fill priority className={`${imageClassName}`} />
    </motion.div>
  );
}
