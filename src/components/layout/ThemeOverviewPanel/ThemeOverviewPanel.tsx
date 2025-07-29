'use client';
import Button from '@/components/shared/Button/Button';
import styles from './ThemeOverviewPanel.module.css';
import ThemeOverviewCard from '@/components/theme/ThemeOverviewCard/ThemeOverviewCard';
import { useEffect, useRef, useState } from 'react';
import { Slide } from '@/types/Slide';
import { useAppSelector } from '@/state/hooks';
import { useDispatch } from 'react-redux';
import { setThemes } from '@/features/themeSlice';
// import { updateTheme } from '@/lib/api/theme/themeActions';

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

  // fetch themes when the year changes
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

  const resetTheme = async (themeId: string) => {
    const confirmed = window.confirm('Are you sure you want to reset this theme? This will delete it entirely from the database.');

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/themes/${themeId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete theme');
      }

      await refetchThemes();
    } catch (err) {
      console.error('Error resetting theme:', err);
    }
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
            editableThemes.map((theme, index) => <ThemeOverviewCard type={theme.type} onUpdate={refetchThemes} index={index} key={index} theme={theme} onReset={() => resetTheme(theme.id as string)} onClaim={() => {}} />)
          ) : (
            <div>No editable themes...</div>
          )}
        </div>
      </div>
    </>
  );
}
