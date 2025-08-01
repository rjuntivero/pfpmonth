'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from './Carousel.module.css';
import { Slide } from '@/types/Slide';

interface Props {
  slides: Slide[];
  setActiveSlide: (slide: Slide) => void;
}

export default function Carousel({ slides, setActiveSlide }: Props) {
  const router = useRouter();
  const CLONE_COUNT = 3;
  const originalLength = slides.length;
  const extendedSlides = [...slides.slice(-CLONE_COUNT), ...slides, ...slides.slice(0, CLONE_COUNT)];

  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number | null>(null);

  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 30 });

  const scrollTo = (index: number) => {
    const container = trackRef.current;
    if (!container) return;

    const target = container.children[index] as HTMLElement;
    if (!target) return;

    const containerWidth = container.offsetWidth;
    const targetLeft = target.offsetLeft;
    const targetWidth = target.offsetWidth;
    const offset = targetLeft - container.offsetLeft - (containerWidth / 2 - targetWidth / 2);

    x.set(-offset);
  };

  const handleScroll = (dir: number) => {
    let newIndex = activeIndex + dir;
    if (newIndex < 0) newIndex = originalLength - 1;
    if (newIndex >= originalLength) newIndex = 0;

    setActiveIndex(newIndex);
    setActiveSlide(slides[newIndex]);
    scrollTo(newIndex + CLONE_COUNT);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleScroll(1);
      if (e.key === 'ArrowLeft') handleScroll(-1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  const realignIfClone = (index: number) => {
    if (index < CLONE_COUNT) {
      setTimeout(() => scrollTo(index + originalLength), 0);
    } else if (index >= originalLength + CLONE_COUNT) {
      setTimeout(() => scrollTo(index - originalLength), 0);
    }
  };

  useLayoutEffect(() => {
    const now = new Date();
    const current = slides.findIndex((s) => s.month === now.toLocaleString('default', { month: 'long' }) && s.year === now.getFullYear());

    const startIndex = current !== -1 ? current : 0;

    scrollTo(startIndex + CLONE_COUNT);
    setActiveIndex(startIndex);
    setActiveSlide(slides[startIndex]);
    setCurrentMonthIndex(current);

    requestAnimationFrame(() => {
      setReady(true);
    });
  }, [slides]);

  return (
    <div className={styles.carouselWrapper} role="region" aria-label="Theme carousel">
      <motion.div
        ref={trackRef}
        className={styles.track}
        style={{
          x: springX,
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      >
        {extendedSlides.map((slide, i) => {
          const logicalIndex = (i - CLONE_COUNT + originalLength) % originalLength;
          const isActive = logicalIndex === activeIndex;
          const slideRoute = slides[logicalIndex]?.route;

          // if route exists, render as a link
          if (slideRoute) {
            return (
              <a
                key={`${slide.id ?? 'placeholder'}-${i}`}
                href={slideRoute}
                className={`${styles.slide} ${isActive ? styles.active : styles.inactive} ${logicalIndex === currentMonthIndex ? styles.currentTheme : ''}`}
                style={{ backgroundImage: `url(${slide.image})` }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${slide.name}${logicalIndex === currentMonthIndex ? ', Current Month' : ''}`}
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveIndex(logicalIndex);
                  setActiveSlide(slides[logicalIndex]);
                  scrollTo(i);
                  realignIfClone(i);

                  router.push(slideRoute);
                }}
              >
                <div className={styles.tagStack}>
                  {/* {slide.tag?.includes('tbd') && (
                  <div className={styles.tbdTag}>
                    <span>TBD</span>
                  </div>
                )} */}
                  {slide.tag?.includes('suggested') && (
                    <div className={styles.suggestedTag} role="note" aria-label="Suggested theme">
                      <span>Suggested</span>
                    </div>
                  )}
                </div>
              </a>
            );
          } else {
            // Slide without route (non-navigable)
            return (
              <div
                key={`${slide.id ?? 'placeholder'}-${i}`}
                className={`${styles.slide} ${isActive ? styles.active : styles.inactive} ${logicalIndex === currentMonthIndex ? styles.currentTheme : ''}`}
                style={{ backgroundImage: `url(${slide.image})` }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${slide.name}${logicalIndex === currentMonthIndex ? ', Current Month' : ''}`}
                onClick={() => {
                  setActiveIndex(logicalIndex);
                  setActiveSlide(slides[logicalIndex]);
                  scrollTo(i);
                  realignIfClone(i);

                  const clickedSlide = slides[logicalIndex];
                  const isClickingActive = logicalIndex === activeIndex;

                  if (!isClickingActive || !clickedSlide?.route) return;

                  router.push(clickedSlide.route as string);
                }}
              >
                <div className={styles.tagStack}>
                  {/* {slide.tag?.includes('tbd') && (
                  <div className={styles.tbdTag}>
                    <span>TBD</span>
                  </div>
                )} */}
                  {slide.tag?.includes('suggested') && (
                    <div className={styles.suggestedTag} role="note" aria-label="Suggested theme">
                      <span>Suggested</span>
                    </div>
                  )}
                </div>
              </div>
            );
          }
        })}
      </motion.div>

      <div className={styles.controls}>
        <button onClick={() => handleScroll(-1)} aria-label="Previous theme">
          {'<'}
        </button>
        <h1 aria-live="polite" tabIndex={-1} className={styles.activeSlideName}>
          {slides[activeIndex]?.name}
        </h1>
        <button onClick={() => handleScroll(1)} aria-label="Next theme">
          {'>'}
        </button>
      </div>
    </div>
  );
}
