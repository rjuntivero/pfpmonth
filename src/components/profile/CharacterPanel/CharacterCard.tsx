'use client';
import Image from 'next/image';
import styles from './CharacterCard.module.css';

import { easeIn, motion } from 'framer-motion';

interface Props {
  selected?: boolean;
  imageURL?: string;
  characterName?: string;
  onClick?: () => void;
}
export default function CharacterCard({ selected, imageURL, characterName, onClick }: Props) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: easeIn }} className={`${styles.container} ${selected && styles.selected}`} onClick={onClick} role="button" tabIndex={0}>
      <Image src={imageURL || '/no-image-placeholder.jpg'} alt="server image" width={85} height={85} className={styles.serverImage} />
      <p className={styles.serverName}>{characterName}</p>
    </motion.div>
  );
}
