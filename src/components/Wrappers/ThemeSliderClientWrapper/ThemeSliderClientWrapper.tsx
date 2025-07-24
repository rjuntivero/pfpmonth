'use client';
import { useEffect, useState } from 'react';
import ThemeSlider from '@/components/theme/ThemeSlider/ThemeSlider';
import styles from './ThemeSliderClientWrapper.module.css';
import { useDispatch } from 'react-redux';
import { setThemeYear, setThemes } from '@/features/themeSlice';
import { useAppSelector } from '@/state/hooks';

interface Props {
  serverId: string;
}

export default function ThemeSliderClientWrapper({ serverId }: Props) {
  const dispatch = useDispatch();
  const year = useAppSelector((state) => state.theme.year);
  const themes = useAppSelector((state) => state.theme.themes);
  const [loading, setLoading] = useState(false);

  const handleYearUpdate = (updatedYear: number) => {
    dispatch(setThemeYear(updatedYear));
  };

  useEffect(() => {
    setLoading(true);
    fetch(`/api/themes?serverId=${serverId}&year=${year}`)
      .then((res) => res.json())
      .then((data) => {
        dispatch(setThemes(data.slides));
        setLoading(false);
      });
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
      {loading ? (
        <div className={styles.loaderWrapper}>
          <div className={styles.loader}></div>
        </div>
      ) : (
        <ThemeSlider slides={themes} display="none" monthClassName={styles.themesPage} />
      )}
    </>
  );
}
