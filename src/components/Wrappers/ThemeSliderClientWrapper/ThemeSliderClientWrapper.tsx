// components/ThemeSliderWrapper/ThemeSliderClientWrapper.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import ThemeSlider from '@/components/ui/Theme/ThemeSlider/ThemeSlider';
import styles from './ThemeSliderClientWrapper.module.css';
import { useDispatch } from 'react-redux';
import { setThemeYear } from '@/features/themeSlice';
import { Slide } from '@/types/Slide';
import { useAppSelector } from '@/state/hooks';

interface Props {
  initialSlides: Slide[];
  initialRender: boolean;
  serverId: string;
}

export default function ThemeSliderClientWrapper({ initialSlides, initialRender, serverId }: Props) {
  const [slides, setSlides] = useState(initialSlides);
  const [loading, setLoading] = useState(false);
  const hasFetchedOnce = useRef(initialRender);
  const year = useAppSelector((state) => state.theme.year);
  const dispatch = useDispatch();

  const handleYearUpdate = (updatedYear: number) => {
    dispatch(setThemeYear(updatedYear));
  };

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
          <button className={styles.navBtn} onClick={() => handleYearUpdate(year - 1)}>
            {'<'}
          </button>
          <h1 className={styles.year}>{year}</h1>
          <button className={styles.navBtn} onClick={() => handleYearUpdate(year + 1)}>
            {'>'}
          </button>
        </div>
      </div>
      {loading ? (
        <div className={styles.loaderWrapper}>
          <div className={styles.loader}></div>
        </div>
      ) : (
        <ThemeSlider slides={slides} display="none" monthClassName={styles.themesPage} />
      )}
    </>
  );
}
