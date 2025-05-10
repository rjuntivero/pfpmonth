import TrendingThemes from '@/components/TrendingThemes/TrendingThemes';
import styles from './page.module.css';
import CallToAction from '@/components/CallToAction/CallToAction';
import ThemeSlider from '@/components/ThemeSlider/ThemeSlider';

export default function Upload() {
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
        <section>
          <TrendingThemes />
        </section>
        <ThemeSlider />
        <section className={styles.CallToAction}>
          <CallToAction />
        </section>
      </main>
    </div>
  );
}
