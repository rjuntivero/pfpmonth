'use client';

import Image from 'next/image';
import styles from './ThemeBackground.module.css';

interface ThemeProps {
  themeImage?: string;
  wrapperClassName?: string;
  imageClassName?: string;
  style?: React.CSSProperties;
}

export default function ThemeBackground({ themeImage, wrapperClassName = '', imageClassName = '', style = {} }: ThemeProps) {
  const safeThemeImage = themeImage ? encodeURI(themeImage) : '/no-image-placeholder.jpg';
  console.log('THE THEME IMAGE IS ', themeImage);

  return (
    <div className={`${wrapperClassName}  ${styles.fadeInZoom}`} style={style}>
      <Image src={safeThemeImage} alt="Background" fill priority className={imageClassName} />
    </div>
  );
}
