'use client';

import { useRouter } from 'next/navigation';
import styles from './ThemeSlider.module.css';
import Carousel from '@/components/theme/Carousel/Carousel';
import { Slide } from '@/types/Slide';
import { useAppSelector } from '@/state/hooks';
import { useEffect } from 'react';

interface Props {
  serverName?: string;
  display?: 'none' | 'date' | 'button' | 'both';
  monthClassName?: string;
  id?: string;
}

export default function ThemeSlider({ serverName, display = 'both', monthClassName, id }: Props) {
  const router = useRouter();
  const activeSlide = useAppSelector((state) => state.theme.activeSlide);
  const slides = useAppSelector((state) => state.theme.themes);
  console.log('ThemeSlider slides:', slides);
  useEffect(() => {
    console.log('ThemeSlider slides:', slides);
  }, [slides]);

  const showDetails = display === 'date' || display === 'both';
  const showButton = display === 'button' || display === 'both';

  return (
    <div id={id} className={styles.wrapper} role="region" aria-label="Monthly themes slider">
      <div className={styles.header}>
        {serverName && <h3>{serverName}</h3>}
        {showDetails && <h2>Themes</h2>}
      </div>

      <section className={styles.sliderSection} aria-live="polite" aria-atomic="true">
        <h3 className={`${styles.date} ${monthClassName || ''}`}>
          {activeSlide?.month} {showDetails && activeSlide?.year}
        </h3>

        <Carousel slides={slides} />
      </section>

      {showButton && (
        <button className={styles.allThemes} onClick={() => router.push('/themes')} aria-label="View all themes">
          All themes
        </button>
      )}
    </div>
  );
}
