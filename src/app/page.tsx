import TrendingThemes from '@/components/ui/Theme/TrendingThemes/TrendingThemes';
import styles from './page.module.css';
import CallToAction from '@/components/layouts/CallToAction/CallToAction';
import ThemeSlider from '@/components/ui/Theme/ThemeSlider/ThemeSlider';
import { fetchThemesAndServer } from '@/lib/fetchThemes';
import { cookies } from 'next/headers';

export default async function Page() {
  const currentYear = new Date().getFullYear();
  const serverId = (await cookies()).get('server_id')?.value;
  const { serverName, themes } = await fetchThemesAndServer(currentYear, serverId);

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
        <ThemeSlider serverName={serverName} slides={themes ?? []} />
        <section className={styles.CallToAction}>
          <CallToAction />
        </section>
      </main>
    </div>
  );
}
