'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ThemeSlider.module.css';
import Carousel from '@/components/ui/Theme/Carousel/Carousel';
import { Slide } from '@/types/Slide';

export default function ThemeSlider({ serverName, slides, display = 'both', monthClassName }: { serverName?: string; slides: Slide[]; display?: 'none' | 'date' | 'button' | 'both'; monthClassName?: string }) {
  const router = useRouter();
  const currentMonthIndex = new Date().getMonth();
  const [activeSlide, setActiveSlide] = useState(slides[currentMonthIndex]);

  const showDetails = display === 'date' || display === 'both';
  const showButton = display === 'button' || display === 'both';

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        {serverName && <h3>{serverName}</h3>}
        {showDetails && <h2>Themes</h2>}
      </div>

      <section className={styles.sliderSection}>
        <h3 className={`${styles.date} ${monthClassName || ''}`}>
          {activeSlide.month} {showDetails && activeSlide.year}
        </h3>

        <Carousel slides={slides} setActiveSlide={setActiveSlide} />

        <div className={styles.fadeLeft} />
        <div className={styles.fadeRight} />
      </section>

      {showButton && (
        <button className={styles.allThemes} onClick={() => router.push('/themes')}>
          All themes
        </button>
      )}
    </div>
  );
}
