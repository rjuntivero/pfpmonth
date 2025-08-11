'use client';
import { useEffect } from 'react';
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
  const themes = useAppSelector((state) => state.theme.themes);
  const loaded = useAppSelector((state) => state.theme.loaded);

  const handleYearUpdate = (updatedYear: number) => {
    dispatch(setThemeYear(updatedYear));
  };

  // initial hydration
  useEffect(() => {
    if (!themes?.length) {
      dispatch(setThemeYear(initialYear));
      dispatch(setThemes(initialThemes));
    }
  }, [dispatch, initialThemes, initialYear, themes?.length]);

  useEffect(() => {
    dispatch(setLoaded(false));
    fetch(`/api/themes?serverId=${serverId}&year=${year}`)
      .then((res) => res.json())
      .then((data) => {
        dispatch(setThemes(data.slides));
        dispatch(setLoaded(true));
      });
  }, [year, serverId, dispatch, initialYear]);

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
        <ThemeSlider slides={themes} display="none" monthClassName={styles.themesPage} />
      )}
    </>
  );
}
