'use client';

import { useState } from 'react';
import { Slide } from '@/types/Slide';
import ProfilePanel from '../ProfilePanel/ProfilePanel';
import TooltipPortal from '@/components/shared/TooltipPortal/TooltipPortal';
import styles from './TimelinePanel.module.css';
import ErrorIcon from '@/components/shared/ErrorIcon/ErrorIcon';
import JoinIcon from '@/components/shared/JoinIcon/JoinIcon';
import LeaveIcon from '@/components/shared/LeaveIcon/LeaveIcon';

interface Props {
  themes: Slide[];
  userCharacters: { theme_id: string }[] | [];
}

export default function TimelinePanel({ themes, userCharacters }: Props) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const handleMouseEnter = (e: React.MouseEvent, text: string) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltip({ text, x: rect.left + rect.width / 2, y: rect.top });
  };

  const handleMouseMove = (e: React.MouseEvent, text: string) => {
    setTooltip({ text, x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  // for mobile devices
  const handleTouchStart = (e: React.TouchEvent, text: string) => {
    const touch = e.touches[0];
    setTooltip({ text, x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTooltip((prev) => (prev ? { ...prev, x: touch.clientX, y: touch.clientY } : null));
  };

  const handleTouchEnd = () => {
    setTooltip(null);
  };

  return (
    <ProfilePanel heading="Timeline" className={styles.timeline} contentClassName={styles.timelineContent}>
      {themes?.map((theme) => {
        const monthLabel = theme?.theme_month ? new Date(Number(theme.theme_month.split('-')[0]), Number(theme.theme_month.split('-')[1]) - 1).toLocaleString('default', { month: 'long' }) : 'N/A';

        const hasTheme = Boolean(theme.id);
        const userJoined = userCharacters.some((char) => char.theme_id === theme.id);
        const tooltipText = hasTheme ? (userJoined ? 'You joined this theme!' : 'You did not join this theme') : 'No theme this month';

        return (
          <div
            key={theme.theme_month}
            className={`${styles.themeMonth} ${hasTheme ? styles.hasTheme : ''} ${userJoined ? styles.joinedTheme : ''}`}
            onMouseEnter={(e) => handleMouseEnter(e, tooltipText)}
            onMouseMove={(e) => handleMouseMove(e, tooltipText)}
            onMouseLeave={handleMouseLeave}
            onTouchStart={(e) => handleTouchStart(e, tooltipText)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className={styles.iconWrapper}>
              {hasTheme && !userJoined && <ErrorIcon width="72" height="72" />}
              {hasTheme && userJoined && <JoinIcon width="72" height="72" />}
              {!hasTheme && <LeaveIcon width="72" height="72" />}
            </div>
            <h1 className={`${userJoined ? styles.joinedTheme : ''}`}>{monthLabel}</h1>
          </div>
        );
      })}

      {tooltip && <TooltipPortal position={{ x: tooltip.x, y: tooltip.y }}>{tooltip.text}</TooltipPortal>}
    </ProfilePanel>
  );
}
