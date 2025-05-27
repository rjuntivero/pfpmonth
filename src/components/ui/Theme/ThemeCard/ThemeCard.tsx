import Button from '../../Button/Button';
import styles from './ThemeCard.module.css';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Slide } from '@/types/Slide';

interface Props {
  theme: Slide;
  onEdit?: (theme: Slide) => void;
  onReset?: (theme: Slide) => void;
  onClaim?: (theme: Slide) => void;
  index?: number;
}

export default function ThemeCard({ theme, onEdit, onReset, onClaim, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25, filter: 'blur(7px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      className={styles.wrapper}
    >
      <div className={styles.imageWrapper}>
        <Image alt="Theme image" src={theme.image || '/no-image-placeholder.jpg'} width={100} height={100} className={styles.themeImage} />
      </div>
      <div className={styles.header}>
        <h2>{theme.month}</h2>
        <h3>{theme.name}</h3>
      </div>
      <div className={styles.body}>
        <p>{theme.description || 'No Description'}</p>
      </div>
      <div className={styles.controls}>
        <Button variant="theme-card" onClick={() => onEdit?.(theme)}>
          edit
        </Button>
        <Button variant="theme-card" onClick={() => onReset?.(theme)}>
          reset
        </Button>
        <Button variant="theme-card" onClick={() => onClaim?.(theme)}>
          claim
        </Button>
      </div>
    </motion.div>
  );
}
