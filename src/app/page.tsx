import TrendingThemes from '@/components/Theme/TrendingThemes/TrendingThemes';
import styles from './page.module.css';
import CallToAction from '@/components/CallToAction/CallToAction';
import ThemeSlider from '@/components/Theme/ThemeSlider/ThemeSlider';
import { fetchThemesAndServer } from '@/utils/fetchThemes';

export default async function Page() {
  const { serverName, themes } = await fetchThemesAndServer();

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
          <div className={styles.getStarted}>
            <h2>Vote. Upload. Slay</h2>
            <button className={styles.actionBtn}>Get Started</button>
          </div>
        </div>
        <section>
          <TrendingThemes />
        </section>
        <ThemeSlider serverName={serverName} themes={themes ?? []} />
        <section className={styles.CallToAction}>
          <CallToAction />
        </section>
      </main>
    </div>
  );
}
