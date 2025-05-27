import ThemeSearch from '@/components/ui/Theme/ThemeSearch/ThemeSearch';
import styles from './page.module.css';

export default function Leaderboard() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.pedestals}>player</div>
        <div className={styles.rankingList}>
          <ThemeSearch />
        </div>
      </main>
    </div>
  );
}
