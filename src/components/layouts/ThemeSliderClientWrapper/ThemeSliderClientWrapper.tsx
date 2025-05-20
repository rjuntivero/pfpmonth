// components/ThemeSliderWrapper/ThemeSliderClientWrapper.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import ThemeSlider from '@/components/ui/Theme/ThemeSlider/ThemeSlider';
import styles from './ThemeSliderClientWrapper.module.css';
import { Slide } from '@/types/Slide';

interface Props {
  initialYear: number;
  initialSlides: Slide[];
  initialRender: boolean;
  serverId: string;
}

export default function ThemeSliderClientWrapper({ initialYear, initialSlides, initialRender, serverId }: Props) {
  const [year, setYear] = useState(initialYear);
  const [slides, setSlides] = useState(initialSlides);
  const [loading, setLoading] = useState(false);
  const hasFetchedOnce = useRef(initialRender);

  useEffect(() => {
    if (hasFetchedOnce.current === false) {
      hasFetchedOnce.current = true;
      return;
    }
    setLoading(true);
    fetch(`/api/themes?serverId=${serverId}&year=${year}`)
      .then((res) => res.json())
      .then((data) => {
        setSlides(data.slides);
        setLoading(false);
      });
  }, [year, serverId]);

  return (
    <>
      <div className={styles.yearNav}>
        <div className={styles.navWrapper}>
          <button className={styles.navBtn} onClick={() => setYear((y) => y - 1)}>
            {'<'}
          </button>
          <h1 className={styles.year}>{year}</h1>
          <button className={styles.navBtn} onClick={() => setYear((y) => y + 1)}>
            {'>'}
          </button>
        </div>
      </div>
      {loading ? <div className={styles.loadingSpinner}>Loading themes…</div> : <ThemeSlider slides={slides} display="none" monthClassName={styles.themesPage} />}
    </>
  );
}
