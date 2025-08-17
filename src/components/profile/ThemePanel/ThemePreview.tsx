'use client';

import { useEffect, useState } from 'react';
import styles from './ThemePreview.module.css';
import Image from 'next/image';
import { useAppSelector } from '@/state/hooks';
import { Theme } from '@/types/Theme';
import { motion } from 'framer-motion';

interface Props {
  characterId?: string;
}

export default function ThemePreview({ characterId }: Props) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const selectedCharacter = useAppSelector((state) => state.profile.selectedCharacter);
  useEffect(() => {
    try {
      async function fetchTheme() {
        const res = await fetch(`/api/theme?characterId=${selectedCharacter!.id}`);
        const data = await res.json();
        setTheme(data);
      }
      fetchTheme();
    } catch (err) {
      console.error('Failed to fetch theme data:', err);
    }
  }, [selectedCharacter, characterId]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className={styles.container}>
      <div className={styles.themeDate}>
        <h1 className={styles.themeYear}>{theme?.theme.theme_month?.split('-')[0]}</h1>
        <h2 className={styles.themeMonth}>{theme?.theme.theme_month ? new Date(Number(theme.theme.theme_month.split('-')[0]), Number(theme.theme.theme_month.split('-')[1]) - 1).toLocaleString('default', { month: 'long' }) : ''}</h2>
      </div>
      <h1 className={styles.themeTitle}>{theme?.theme.name}</h1>
      <div className={styles.imageContainer}>
        <Image src={theme?.theme.image_url || '/no-image-placeholder.jpg'} alt="Theme Preview" width={300} height={400} className={styles.image} />
      </div>
    </motion.div>
  );
}
