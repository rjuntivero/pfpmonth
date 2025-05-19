'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';
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
  }, []);

  return (
    <div className={styles.carouselWrapper}>
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

          return (
            <div
              key={`${slide.id ?? 'placeholder'}-${i}`}
              className={`${styles.slide} ${isActive ? styles.active : styles.inactive} ${logicalIndex === currentMonthIndex ? styles.currentTheme : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
              onClick={() => {
                setActiveIndex(logicalIndex);
                setActiveSlide(slides[logicalIndex]);
                scrollTo(i);
                realignIfClone(i);

                const clickedSlide = slides[logicalIndex];
                const isClickingActive = logicalIndex === activeIndex;

                if (!isClickingActive || !clickedSlide?.id) return;

                // navigation
                if (clickedSlide.type === 'final') {
                  router.push(`/themes/${clickedSlide.id}`);
                } else if (clickedSlide.type === 'poll' || clickedSlide.type === 'tbd') {
                  router.push(clickedSlide.route as string);
                }
              }}
            >
              {slide.tag === 'leading' && (
                <div className={styles.voteTag}>
                  <Image src="/voteTag.svg" alt="#1 vote" width={20} height={20} />
                  <span>#1 vote</span>
                </div>
              )}
              {slide.tag === 'tbd' && (
                <div className={styles.tbdTag}>
                  <span>TBD</span>
                </div>
              )}
            </div>
          );
        })}
      </motion.div>

      <div className={styles.controls}>
        <button onClick={() => handleScroll(-1)}>{'<'}</button>
        <button className={styles.activeSlideName}>{slides[activeIndex]?.name}</button>
        <button onClick={() => handleScroll(1)}>{'>'}</button>
      </div>
    </div>
  );
}
