import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <header className={styles.header}>
            <h1>
              <span className={styles.highlight}>
                P<span>F</span>P
              </span>
              Mo<span>n</span>t<span>h</span>
            </h1>
            <p>Create Monthly Profile Themes for your Discord server</p>
          </header>
          <h2>Vote. Upload. Slay</h2>
        </div>
      </main>
    </div>
  );
}
