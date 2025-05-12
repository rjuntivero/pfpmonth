'use client';

import { useState } from 'react';
import styles from './ThemeSlider.module.css';
import Carousel from '@/components/Carousel/Carousel';

const slides = [
  { month: 'January', year: 2025, image: '/sinners.jpg' },
  { month: 'February', year: 2025, image: '/avatar.jpg' },
  { month: 'March', year: 2025, image: '/mario.jpg' },
  { month: 'April', year: 2025, image: '/avengers.jpg' },
  { month: 'May', year: 2025, image: '/adventure.jpg' },
  { month: 'June', year: 2025, image: '/awog.jpg' },
  { month: 'July', year: 2025, image: '/simpsons.avif' },
  { month: 'August', year: 2025, image: '/powerpuff.jpg' },
  { month: 'September', year: 2025, image: '/lol.jpg' },
  { month: 'October', year: 2025, image: '/valorant.jpg' },
  { month: 'November', year: 2025, image: '/fortnite.jpeg' },
  { month: 'December', year: 2025, image: '/naruto.jpg' },
];

export default function ThemeSlider() {
  const [activeSlide, setActiveSlide] = useState(slides[0]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3>barbz</h3>
        <h2>Themes</h2>
      </div>

      <section className={styles.sliderSection}>
        <h3 className={styles.date}>
          {activeSlide.month} {activeSlide.year}
        </h3>
        <Carousel slides={slides} setActiveSlide={setActiveSlide} />
        <div className={styles.fadeLeft} />
        <div className={styles.fadeRight} />
      </section>

      <button className={styles.allThemes}>All themes</button>
    </div>
  );
}
