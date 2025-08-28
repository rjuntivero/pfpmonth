'use client';

import { Slide } from '@/types/Slide';
import ProfilePanel from '../ProfilePanel/ProfilePanel';
import TooltipPortal from '@/components/shared/TooltipPortal/TooltipPortal';
import styles from './TimelinePanel.module.css';
import ErrorIcon from '@/components/shared/ErrorIcon/ErrorIcon';
import JoinIcon from '@/components/shared/JoinIcon/JoinIcon';
import LeaveIcon from '@/components/shared/LeaveIcon/LeaveIcon';
import User from '@/components/user/User';
import Dropdown from '@/components/shared/Dropdown/Dropdown';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/state/hooks';
import { setSelectedTimelineYear } from '@/features/profileSlice';
import { useTooltip } from '@/hooks/useTooltip';

interface Props {
  themes: Slide[];
  userCharacters: { theme_id: string }[] | [];
}

export default function TimelinePanel({ themes, userCharacters }: Props) {
  const dispatch = useDispatch();

  const selectedTimelineYear = useAppSelector((state) => state.profile.selectedTimelineYear);

  const { tooltip, handleMouseEnter, handleMouseMove, handleMouseLeave, handleTouchStart, handleTouchMove, handleTouchEnd } = useTooltip();

  return (
    <ProfilePanel
      heading="Timeline"
      className={styles.timeline}
      contentClassName={styles.timelineContent}
      headerAction={<Dropdown selected={selectedTimelineYear} onSelect={(val: string) => dispatch(setSelectedTimelineYear(val))} items={['2025', '2024', '2023']} />}
    >
      {themes?.map((theme) => {
        const monthLabel = theme?.theme_month ? new Date(Number(theme.theme_month.split('-')[0]), Number(theme.theme_month.split('-')[1]) - 1).toLocaleString('default', { month: 'long' }) : 'N/A';

        const hasTheme = Boolean(theme.id);
        const userJoined = userCharacters.some((char) => char.theme_id === theme.id);
        const tooltipText = hasTheme ? userJoined ? <User /> : 'You did not join this theme' : 'No theme';

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

      {tooltip && <TooltipPortal position={{ x: tooltip.x, y: tooltip.y }}>{tooltip.content}</TooltipPortal>}
    </ProfilePanel>
  );
}
