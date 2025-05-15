'use client';

import { useState } from 'react';
import styles from './ThemeSlider.module.css';
import { useRouter } from 'next/navigation';
import Carousel from '@/components/Carousel/Carousel';

interface Theme {
  name: string;
  start_date: string; // e.g., "2025-05-01"
  image_url: string;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function ThemeSlider({ serverName, themes }: { serverName?: string; themes: Theme[] }) {
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  const completeSlides = MONTHS.map((monthName, monthIndex) => {
    const theme = themes.find((t) => {
      const [yearStr, monthStr] = t.start_date.split('-');
      const themeYear = Number(yearStr);
      const themeMonth = Number(monthStr); // 1–12

      const isMatch = themeYear === currentYear && themeMonth === monthIndex + 1;

      if (isMatch) {
        console.log('✅ MAPPED:', {
          theme: t.name,
          start_date: t.start_date,
          matchedMonthIndex: monthIndex,
          matchedMonthName: monthName,
        });
      }

      return isMatch;
    });

    return {
      month: monthName,
      year: currentYear,
      image: theme?.image_url || '/no-image-placeholder.jpg',
      name: theme?.name || 'No Theme Yet',
    };
  });

  const [activeSlide, setActiveSlide] = useState(completeSlides[new Date().getMonth()]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3>{serverName}</h3>
        <h2>Themes</h2>
      </div>

      <section className={styles.sliderSection}>
        <h3 className={styles.date}>
          {activeSlide.month} {activeSlide.year}
        </h3>
        <Carousel slides={completeSlides} setActiveSlide={setActiveSlide} />
        <div className={styles.fadeLeft} />
        <div className={styles.fadeRight} />
      </section>

      <button className={styles.allThemes} onClick={() => router.push('/themes')}>
        All themes
      </button>
    </div>
  );
}
