'use client';

import { useEffect, useState } from 'react';
import styles from './ThemePreview.module.css';
import Image from 'next/image';
import { useAppSelector } from '@/state/hooks';
import { Theme } from '@/types/Theme';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toSlug } from '@/lib/utils/stringUtils';

export default function ThemePreview() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const selectedCharacter = useAppSelector((state) => state.profile.selectedCharacter);

  // slug, ex: "October-2025"
  const themeSlug = theme?.theme_month ? toSlug(Number(theme.theme_month.split('-')[1]) - 1, Number(theme.theme_month.split('-')[0])) : '';
  useEffect(() => {
    try {
      async function fetchTheme() {
        const res = await fetch(`/api/theme?characterId=${selectedCharacter?.id}`);
        const data = await res.json();
        setTheme(data);
      }
      fetchTheme();
    } catch (err) {
      console.error('Failed to fetch theme data:', err);
    }
  }, [selectedCharacter]);

  return (
    <motion.div key={theme?.id} initial={{ opacity: 0.5, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className={styles.container}>
      <div className={styles.themeDate}>
        <h1 className={styles.themeYear}>{theme?.theme_month?.split('-')[0] || 'no month'}</h1>
        <h2 className={styles.themeMonth}>{theme?.theme_month ? new Date(Number(theme.theme_month.split('-')[0]), Number(theme.theme_month.split('-')[1]) - 1).toLocaleString('default', { month: 'long' }) : ''}</h2>
      </div>
      <h1 className={styles.themeTitle}>{theme?.name}</h1>
      <div className={styles.imageContainer}>
        <Link href={`/themes/month/${themeSlug}`}>
          <Image src={theme?.image_url || '/no-image-placeholder.jpg'} alt="Theme Preview" width={300} height={400} className={styles.image} />
        </Link>
      </div>
    </motion.div>
  );
}
