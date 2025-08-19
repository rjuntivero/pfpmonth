'use client';

import Image from 'next/image';
import styles from './ThemeSliderBackdrop.module.css';
import { useAppSelector } from '@/state/hooks';

interface Props {
  wrapperClassName?: string;
  imageClassName?: string;
}

export default function ThemeSliderBackdrop({ wrapperClassName = '', imageClassName = '' }: Props) {
  const activeSlide = useAppSelector((state) => state.theme.activeSlide);

  console.log('ThemeBackground rendering with image:', activeSlide?.image);
  return (
    <div key={activeSlide?.id} className={`${wrapperClassName}  ${styles.fadeInZoom}`}>
      <Image src={activeSlide?.image || '/no-image-placeholder.jpg'} alt="Background" fill priority quality={60} className={imageClassName} aria-placeholder="theme background image" />
    </div>
  );
}
