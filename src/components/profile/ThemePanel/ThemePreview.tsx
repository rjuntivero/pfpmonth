'use client';

import styles from './ThemePreview.module.css';
import Image from 'next/image';

interface Props {
  serverId: string;
  characterId: string;
}

export default function ThemePanel({ serverId, characterId }: Props) {
  return (
    <div className={styles.container}>
      <Image src="/theme-preview.png" alt="Theme Preview" width={300} height={200} className={styles.image} />
    </div>
  );
}
