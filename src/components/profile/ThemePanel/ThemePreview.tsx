'use client';

import { useEffect, useState } from 'react';
import styles from './ThemePreview.module.css';
import Image from 'next/image';
import { useAppSelector } from '@/state/hooks';
import { Theme } from '@/types/Theme';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toSlug } from '@/lib/utils/stringUtils';
import { useTooltip } from '@/hooks/useTooltip';
import TooltipPortal from '@/components/shared/TooltipPortal/TooltipPortal';

export default function ThemePreview() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const selectedCharacter = useAppSelector((state) => state.profile.selectedCharacter);

  // slug, ex: "October-2025"
  const themeSlug = theme?.theme_month ? toSlug(Number(theme.theme_month.split('-')[1]) - 1, Number(theme.theme_month.split('-')[0])) : '';

  const { tooltip, handleMouseEnter, handleMouseMove, handleMouseLeave, handleTouchStart, handleTouchMove, handleTouchEnd } = useTooltip();

  // fetch theme data when selectedCharacter changes
  useEffect(() => {
    console.log('Selected character changed:', selectedCharacter);
    try {
      async function fetchTheme() {
        const res = await fetch(`/api/theme/${selectedCharacter?.id}`);
        const data = await res.json();
        setTheme(data);
      }
      fetchTheme();
    } catch (err) {
      console.error('Failed to fetch theme data:', err);
    }
  }, [selectedCharacter]);

  const tooltipText = theme?.name;

  return (
    <motion.div key={theme?.id} initial={{ opacity: 0.5, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className={styles.container}>
      <div className={styles.themeDate}>
        <h1 className={styles.themeYear}>{theme?.theme_month?.split('-')[0] || 'no month'}</h1>
        <h2 className={styles.themeMonth}>{theme?.theme_month ? new Date(Number(theme.theme_month.split('-')[0]), Number(theme.theme_month.split('-')[1]) - 1).toLocaleString('default', { month: 'long' }) : ''}</h2>
      </div>
      <div
        className={styles.imageContainer}
        onMouseEnter={(e) => handleMouseEnter(e, tooltipText)}
        onMouseMove={(e) => handleMouseMove(e, tooltipText)}
        onMouseLeave={handleMouseLeave}
        onTouchStart={(e) => handleTouchStart(e, tooltipText)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Link href={`/themes/month/${themeSlug}`}>
          <Image src={theme?.image_url || '/no-image-placeholder.jpg'} alt="Theme Preview" width={400} height={500} className={styles.image} />
        </Link>
      </div>
      {tooltip && <TooltipPortal position={{ x: tooltip.x, y: tooltip.y }}>{<h1 className={styles.themeTitle}>{tooltip.content}</h1>}</TooltipPortal>}
    </motion.div>
  );
}
