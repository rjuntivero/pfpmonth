'use client';
import Button from '@/components/ui/Button/Button';
import styles from './ThemeOverviewPanel.module.css';
import ThemeCard from '@/components/ui/Theme/ThemeCard/ThemeCard';
import { useEffect, useRef, useState } from 'react';
import { Slide } from '@/types/Slide';
import { useAppSelector } from '@/state/hooks';

interface Props {
  initialThemes: Slide[];
  serverId: string;
}

export default function ThemeOverviewPanel({ initialThemes, serverId }: Props) {
  const year = useAppSelector((state) => state.theme.year);
  const [themes, setThemes] = useState<Slide[]>(initialThemes);
  const [loading, setLoading] = useState(false);
  const hasFetchedOnce = useRef(false);

  useEffect(() => {
    if (!hasFetchedOnce.current) {
      hasFetchedOnce.current = true;
      return;
    }

    setLoading(true);
    fetch(`/api/themes?serverId=${serverId}&year=${year}`)
      .then((res) => res.json())
      .then((data) => {
        setThemes(data.slides);
        setLoading(false);
      });
  }, [year, serverId]);

  const handleEdit = (theme: Slide) => {
    console.log('Editing', theme);
  };

  const handleReset = (theme: Slide) => {
    console.log('Resetting', theme);
  };

  const handleClaim = (theme: Slide) => {
    console.log('Claiming', theme);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleClick = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const currentDate = new Date();

  const editableThemes = themes.filter((theme) => {
    const themeDate = new Date(`${theme.month} 1, ${theme.year}`);
    return themeDate >= new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  });

  editableThemes.forEach((theme) => {
    console.log('FETCHED THEME DETAILS', theme);
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
            editableThemes.map((theme, index) => <ThemeCard index={index} key={index} theme={theme} onEdit={handleEdit} onReset={handleReset} onClaim={handleClaim} />)
          ) : (
            <div>No editable themes...</div>
          )}
        </div>
        <div className={styles.footer}>
          <Button>Save</Button>
        </div>
      </div>
    </>
  );
}
