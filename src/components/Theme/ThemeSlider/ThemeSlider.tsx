'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ThemeSlider.module.css';
import Carousel from '@/components/Carousel/Carousel';

interface Theme {
  name: string;
  start_date: string;
  image_url: string;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function ThemeSlider({ serverName, themes, display = 'both' }: { serverName?: string; themes: Theme[]; display?: 'none' | 'date' | 'button' | 'both' }) {
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  const completeSlides = MONTHS.map((monthName, monthIndex) => {
    const theme = themes.find((t) => {
      const [yearStr, monthStr] = t.start_date.split('-');
      return Number(yearStr) === currentYear && Number(monthStr) === monthIndex + 1;
    });

    return {
      month: monthName,
      year: currentYear,
      image: theme?.image_url || '/no-image-placeholder.jpg',
      name: theme?.name || 'No Theme',
    };
  });

  const [activeSlide, setActiveSlide] = useState(completeSlides[new Date().getMonth()]);

  const showDate = display === 'date' || display === 'both';
  const showButton = display === 'button' || display === 'both';

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        {serverName && <h3>{serverName}</h3>}
        <h2>Themes</h2>
      </div>

      <section className={styles.sliderSection}>
        <h3 className={styles.date}>
          {activeSlide.month} {showDate && activeSlide.year}
        </h3>
        <Carousel slides={completeSlides} setActiveSlide={setActiveSlide} />
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
