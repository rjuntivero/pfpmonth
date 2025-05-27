'use client';
import Button from '@/components/ui/Button/Button';
import styles from './ThemeOverviewPanel.module.css';
import ThemeCard from '@/components/ui/Theme/ThemeCard/ThemeCard';
import { useState } from 'react';
import { Theme } from '@/types/Theme';

export default function ThemeOverviewPanel({ themes }: { themes?: Theme[] }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleClick = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <Button variant="theme-sidebar" onClick={handleClick}>
        open
      </Button>
      <div className={styles.wrapper} style={{ transform: isSidebarOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <div className={styles.header}>
          <h2>Theme Overview</h2>
        </div>
        <div className={styles.content}>
          {themes?.map((theme, index) => (
            <ThemeCard key={index} theme={theme} />
          ))}
        </div>
        <div className={styles.footer}>
          <Button>Save</Button>
        </div>
      </div>
    </>
  );
}
