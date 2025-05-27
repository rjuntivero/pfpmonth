import { Theme } from '@/types/Theme';
import Button from '../../Button/Button';
import styles from './ThemeCard.module.css';
import Image from 'next/image';

export default function ThemeCard({ theme }: { theme?: Theme }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.imageWrapper}>
        <Image alt="Theme image" src={theme?.image || '/no-image-placeholder.jpg'} width={100} height={100} className={styles.themeImage} />
      </div>
      <div className={styles.header}>
        <h2>{theme?.month}</h2>
        <h3>{theme?.name}</h3>
      </div>
      <div className={styles.body}>
        <p>{theme?.description || 'No Description'}</p>
      </div>
      <div className={styles.controls}>
        <Button variant="theme-card">edit</Button>
        <Button variant="theme-card">reset</Button>
        <Button variant="theme-card">claim</Button>
      </div>
    </div>
  );
}
