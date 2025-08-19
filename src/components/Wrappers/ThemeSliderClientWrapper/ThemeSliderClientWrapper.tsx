'use client';
import { useEffect, useState } from 'react';
import ThemeSlider from '@/components/theme/ThemeSlider/ThemeSlider';
import styles from './ThemeSliderClientWrapper.module.css';
import { useDispatch } from 'react-redux';
import { setLoaded, setThemeYear, setThemes } from '@/features/themeSlice';
import { useAppSelector } from '@/state/hooks';
import { Slide } from '@/types/Slide';

interface Props {
  serverId: string;
  initialThemes: Slide[];
  initialYear: number;
}

export default function ThemeSliderClientWrapper({ serverId, initialThemes, initialYear }: Props) {
  const dispatch = useDispatch();
  const year = useAppSelector((state) => state.theme.year);
  const loaded = useAppSelector((state) => state.theme.loaded);
  const [hydrated, setHydrated] = useState(false);

  const handleYearUpdate = (updatedYear: number) => {
    dispatch(setThemeYear(updatedYear));
  };

  // initial hydration
  useEffect(() => {
    dispatch(setThemeYear(initialYear));
    dispatch(setThemes(initialThemes));
    dispatch(setLoaded(true));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    dispatch(setLoaded(false));

    try {
      async function fetchThemes() {
        const res = await fetch(`/api/themes?year=${year}&serverId=${serverId}`);
        const data = await res.json();

        dispatch(setThemes(data.slides));
        dispatch(setLoaded(true));
      }
      fetchThemes();
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, serverId, dispatch]);

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
      {!loaded ? (
        <div className={styles.loaderWrapper}>
          <div className={styles.loader}></div>
        </div>
      ) : (
        <ThemeSlider display="none" monthClassName={styles.themesPage} />
      )}
    </>
  );
}
