'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ThemeSlider.module.css';
import Carousel from '@/components/theme/Carousel/Carousel';
import { Slide } from '@/types/Slide';

export default function ThemeSlider({ serverName, slides, display = 'both', monthClassName }: { serverName?: string; slides: Slide[]; display?: 'none' | 'date' | 'button' | 'both'; monthClassName?: string }) {
  const router = useRouter();
  const currentMonthIndex = new Date().getMonth();
  const [activeSlide, setActiveSlide] = useState(slides[currentMonthIndex]);

  const showDetails = display === 'date' || display === 'both';
  const showButton = display === 'button' || display === 'both';

  return (
    <div className={styles.wrapper} role="region" aria-label="Monthly themes slider">
      <div className={styles.header}>
        {serverName && <h3>{serverName}</h3>}
        {showDetails && <h2>Themes</h2>}
      </div>

      <section className={styles.sliderSection} aria-live="polite" aria-atomic="true">
        <h3 className={`${styles.date} ${monthClassName || ''}`}>
          {activeSlide?.month} {showDetails && activeSlide?.year}
        </h3>

        <Carousel slides={slides} setActiveSlide={setActiveSlide} />
      </section>

      {showButton && (
        <button className={styles.allThemes} onClick={() => router.push('/themes')} aria-label="View all themes">
          All themes
        </button>
      )}
    </div>
  );
}
