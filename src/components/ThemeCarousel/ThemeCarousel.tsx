'use client';

import { useState } from 'react';
import styles from './ThemeCarousel.module.css';

export default function ThemeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(1);

  const slides = [1, 2, 3];

  const goLeft = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goRight = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, slides.length - 1));
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3>barbz</h3> <h2>Themes</h2>
      </div>{' '}
      <section>
        <h3 className={styles.date}>May 2025</h3>
        <section className={styles.carousel}>
          <button className={styles.navLeft} onClick={goLeft}>
            {'<'}
          </button>
          <div className={styles.track}>
            {slides.map((num, i) => (
              <div className={styles.slide} key={i}>
                {num}
              </div>
            ))}
          </div>
          <button className={styles.navRight} onClick={goRight}>
            {'>'}
          </button>
        </section>
      </section>
      <button className={styles.allThemes}>All themes</button>
    </div>
  );
}
