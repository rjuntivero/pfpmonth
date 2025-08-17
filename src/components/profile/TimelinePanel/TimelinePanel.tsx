'use client';

import { Slide } from '@/types/Slide';
import ProfilePanel from '../ProfilePanel/ProfilePanel';
import styles from './TimelinePanel.module.css';

interface Props {
  themes: Slide[];
}

export default function ThemePanel({ themes }: Props) {
  return (
    <ProfilePanel heading="Timeline" className={styles.timeline} contentClassName={styles.timelineContent}>
      {themes?.map((theme) => {
        return (
          <div key={theme.theme_month} className={`${styles.themeMonth} ${theme.id && styles.hasTheme}`}>
            <h1>{theme?.theme_month ? new Date(Number(theme.theme_month.split('-')[0]), Number(theme.theme_month.split('-')[1]) - 1).toLocaleString('default', { month: 'long' }) : 'N/A'}</h1>
          </div>
        );
      })}
    </ProfilePanel>
  );
}
