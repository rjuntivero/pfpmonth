import Poll from '@/components/ui/Poll/Poll';
import styles from './page.module.css';

export default function Page() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>
            February <span>2025</span>
          </h1>
          <h2>Vote for a Theme</h2>
        </div>
        <div className={styles.polls}>
          <Poll image="/sinners.jpg" />
          <Poll image="/adventure.jpg" />
          <Poll image="/avatar.jpg" />
          <Poll image="/naruto.jpg" />
          <Poll image="/naruto.jpg" />
          <Poll image="/naruto.jpg" />
          <Poll image="/naruto.jpg" />
        </div>
      </main>
    </div>
  );
}
