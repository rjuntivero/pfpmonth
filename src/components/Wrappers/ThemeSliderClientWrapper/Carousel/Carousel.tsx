'use client';

import { useLayoutEffect, useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from './Carousel.module.css';
import { Slide } from '@/types/Slide';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setActiveSlide } from '@/features/themeSlice';
import Image from 'next/image';
interface Props {
  slides: Slide[];
}

export default function Carousel({ slides }: Props) {
  const router = useRouter();
  const CLONE_COUNT = 3;
  const originalLength = slides.length;
  const extendedSlides = [
    ...slides.slice(-CLONE_COUNT),
    ...slides,
    ...slides.slice(0, CLONE_COUNT),
  ];

  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const dispatch = useDispatch();

  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number | null>(null);

  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 30 });

  const scrollTo = useCallback(
    (index: number) => {
      const container = trackRef.current;
      if (!container) return;

      const target = container.children[index] as HTMLElement;
      if (!target) return;

      const containerWidth = container.offsetWidth;
      const targetLeft = target.offsetLeft;
      const targetWidth = target.offsetWidth;
      const offset = targetLeft - container.offsetLeft - (containerWidth / 2 - targetWidth / 2);

      x.set(-offset);
    },
    [x]
  );

  const handleScroll = useCallback(
    (dir: number) => {
      let newIndex = activeIndex + dir;
      if (newIndex < 0) newIndex = originalLength - 1;
      if (newIndex >= originalLength) newIndex = 0;

      setActiveIndex(newIndex);
      dispatch(setActiveSlide(slides[newIndex]));
      scrollTo(newIndex + CLONE_COUNT);
    },
    [activeIndex, originalLength, slides, scrollTo, dispatch]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleScroll(1);
      if (e.key === 'ArrowLeft') handleScroll(-1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, handleScroll]);

  const realignIfClone = (index: number) => {
    if (index < CLONE_COUNT) {
      setTimeout(() => scrollTo(index + originalLength), 0);
    } else if (index >= originalLength + CLONE_COUNT) {
      setTimeout(() => scrollTo(index - originalLength), 0);
    }
  };

  useLayoutEffect(() => {
    const now = new Date();
    const current = slides.findIndex(
      (s) =>
        s.month === now.toLocaleString('default', { month: 'long' }) && s.year === now.getFullYear()
    );

    const startIndex = current !== -1 ? current : 0;

    scrollTo(startIndex + CLONE_COUNT);
    setActiveIndex(startIndex);
    dispatch(setActiveSlide(slides[startIndex]));
    setCurrentMonthIndex(current);

    requestAnimationFrame(() => {
      setReady(true);
    });
  }, [slides, scrollTo, dispatch]);

  return (
    <div className={styles.carouselWrapper} role="region" aria-label="Theme carousel">
      <motion.div
        ref={trackRef}
        className={styles.track}
        style={{
          x: springX,
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}>
        {extendedSlides.map((slide, i) => {
          const logicalIndex = (i - CLONE_COUNT + originalLength) % originalLength;
          const isActive = logicalIndex === activeIndex;

          return (
            <div
              key={`${slide.id ?? 'placeholder'}-${i}`}
              className={`${styles.slide} ${isActive ? styles.active : styles.inactive} ${
                logicalIndex === currentMonthIndex ? styles.currentTheme : ''
              }`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${slide.name}${
                logicalIndex === currentMonthIndex ? ', Current Month' : ''
              }`}
              onClick={() => {
                setActiveIndex(logicalIndex);
                dispatch(setActiveSlide(slides[logicalIndex]));
                scrollTo(i);
                realignIfClone(i);

                const clickedSlide = slides[logicalIndex];
                const isClickingActive = logicalIndex === activeIndex;

                if (!isClickingActive || !clickedSlide?.route) return;

                router.push(clickedSlide.route as string);
              }}>
              <div className={`${styles.flipCard} ${flippedIndex === i ? styles.flip : ''}`}>
                <div className={styles.flipCardInner}>
                  <button
                    className={styles.viewDetails}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFlippedIndex(flippedIndex === i ? null : i);
                    }}>
                    {flippedIndex === i ? 'X' : '?'}
                  </button>
                  <div className={styles.flipCardFront}>
                    <Image
                      className={styles.image}
                      src={slide.image}
                      alt={slide.name}
                      fill
                      priority={true}
                      sizes="100vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className={styles.flipCardBack}>
                    <div>
                      <h1>Title: </h1>
                      <p>{slide.name}</p>
                    </div>
                    <div>
                      <h1>Description: </h1>
                      <p>{slide.description}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.tagStack}>
                {slide.tag?.includes('suggested') && (
                  <div className={styles.suggestedTag} role="note" aria-label="Suggested theme">
                    <span>Suggested</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </motion.div>

      <div className={styles.controls}>
        <button onClick={() => handleScroll(-1)} aria-label="Previous theme">
          {'<'}
        </button>
        <h1 aria-live="polite" tabIndex={-1} className={styles.activeSlideName}>
          <Link href={slides[activeIndex]?.route ?? '#'}>{slides[activeIndex]?.name}</Link>
        </h1>
        <button onClick={() => handleScroll(1)} aria-label="Next theme">
          {'>'}
        </button>
      </div>
    </div>
  );
}
