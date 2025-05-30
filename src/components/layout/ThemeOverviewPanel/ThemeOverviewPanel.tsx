'use client';
import Button from '@/components/shared/Button/Button';
import styles from './ThemeOverviewPanel.module.css';
import ThemeCard from '@/components/theme/ThemeCard/ThemeCard';
import { useEffect, useRef, useState } from 'react';
import { Slide } from '@/types/Slide';
import { useAppSelector } from '@/state/hooks';
import { useDispatch } from 'react-redux';
import { setThemes } from '@/features/themeSlice';

interface Props {
  initialThemes: Slide[];
  serverId: string;
}

export default function ThemeOverviewPanel({ initialThemes, serverId }: Props) {
  const year = useAppSelector((state) => state.theme.year);
  const themes = useAppSelector((state) => state.theme.themes);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      dispatch(setThemes(initialThemes));
      didMountRef.current = true;
    }
  }, [initialThemes, dispatch]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/themes?serverId=${serverId}&year=${year}`)
      .then((res) => res.json())
      .then((data) => {
        dispatch(setThemes(data.slides));
        setLoading(false);
      });
  }, [year, serverId, dispatch]);

  const refetchThemes = async () => {
    const res = await fetch(`/api/themes?serverId=${serverId}&year=${year}`);
    const data = await res.json();
    dispatch(setThemes(data.slides));
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleClick = () => setIsSidebarOpen((prev) => !prev);

  const currentDate = new Date();
  const editableThemes = themes.filter((theme) => {
    const themeDate = new Date(`${theme.month} 1, ${theme.year}`);
    return themeDate >= new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  });

  return (
    <>
      <Button variant="theme-sidebar" onClick={handleClick}>
        edit themes
      </Button>
      <div className={styles.wrapper} style={{ transform: isSidebarOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <div className={styles.header}>
          <h2>Theme Overview</h2>
        </div>
        <div className={styles.content}>
          {loading ? (
            <div className={styles.loaderWrapper}>
              <div className={styles.loader}></div>
            </div>
          ) : editableThemes.length >= 1 ? (
            editableThemes.map((theme, index) => <ThemeCard onUpdate={refetchThemes} index={index} key={index} theme={theme} onReset={() => {}} onClaim={() => {}} />)
          ) : (
            <div>No editable themes...</div>
          )}
        </div>
      </div>
    </>
  );
}
