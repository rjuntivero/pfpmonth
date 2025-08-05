'use client';
import Image from 'next/image';
import styles from './User.module.css';
import { Participant } from '@/types/Participant';
import { useState } from 'react';

export default function User({ participant }: { participant?: Participant }) {
  const [characterName, setCharacterName] = useState<string | 'No Character'>(participant?.character_name || 'No Character');

  return (
    <div className={styles.container}>
      <div className={styles.avatarContainer}>
        <Image src={participant?.image_url || '/no-image-placeholder.jpg'} alt="User photo" fill className={styles.avatar} />
      </div>
      <div className={styles.user}>
        <h3 className={styles.username}>{participant?.username}</h3>
        <h3 className={styles.character}>{characterName}</h3>
      </div>
    </div>
  );
}
