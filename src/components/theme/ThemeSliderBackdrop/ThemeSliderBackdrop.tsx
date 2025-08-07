'use client';

import Image from 'next/image';
import styles from './ThemeSliderBackdrop.module.css';
import { useAppSelector } from '@/state/hooks';
import { useEffect } from 'react';

interface Props {
  wrapperClassName?: string;
  imageClassName?: string;
}

export default function ThemeSliderBackdrop({ wrapperClassName = '', imageClassName = '' }: Props) {
  const activeSlide = useAppSelector((state) => state.theme.activeSlide);

  useEffect(() => {
    console.log('ThemeBackground activeSlide changed:', activeSlide);
  }, [activeSlide]);
  if (!activeSlide) {
    console.log('ThemeBackground no activeSlide, rendering null');
    return null;
  }

  console.log('ThemeBackground rendering with image:', activeSlide.image);
  return (
    <div key={activeSlide.id} className={`${wrapperClassName}  ${styles.fadeInZoom}`}>
      <Image src={activeSlide?.image || '/no-image-placeholder.jpg'} alt="Background" fill priority className={imageClassName} />
    </div>
  );
}
