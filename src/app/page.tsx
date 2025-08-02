import TrendingThemes from '@/components/theme/TrendingThemes/TrendingThemes';
import styles from './page.module.css';
import CallToAction from '@/components/layout/CallToAction/CallToAction';
import ThemeSlider from '@/components/theme/ThemeSlider/ThemeSlider';
import { fetchThemes } from '@/lib/api/theme/fetchThemes';
import { cookies } from 'next/headers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PFPMonth - Home',
  description: 'Welcome to PFPMonth home page.',
  openGraph: {
    title: 'PFPMonth - Home',
    description: 'Welcome to PFPMonth home page.',
    url: 'https://pfpmonth.com',
    siteName: 'PFPMonth',
    // images: [
    //   {
    //     url: 'https://pfpmonth.com/og-image.png',
    //     width: 1200,
    //     height: 630,
    //     alt: 'PFPMonth OG Image',
    //   },
    // ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PFPMonth - Home',
    description: 'Welcome to PFPMonth home page.',
    // images: ['https://pfpmonth.com/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://pfpmonth.com',
  },
};

export default async function Page() {
  const currentYear = new Date().getFullYear();
  const serverId = (await cookies()).get('server_id')?.value;
  const { serverName, themes } = await fetchThemes(currentYear, serverId);

  return (
    <div className={styles.page}>
      <a href="#themes" className="sr-only focus:not-sr-only">
        Skip to themes
      </a>
      <main className={styles.main} id="main">
        <div className={styles.hero}>
          <header className={styles.header} role="banner">
            <h1>
              <span className={styles.highlight}>
                P<span>F</span>P
              </span>
              Mo<span>n</span>t<span>h</span>
            </h1>
            <p>Create Monthly Profile Themes for your Discord server</p>
          </header>
          <div className={styles.getStarted}>
            <h2>Pitch It. Pick It. PFP It.</h2>
            <button className={styles.actionBtn} aria-label="Start creating profile themes for your Discord server">
              Get Started
            </button>
          </div>
        </div>
        <section aria-hidden="true">
          <TrendingThemes />
        </section>
        <section role="region" aria-label="Current Server Themes">
          <ThemeSlider id="themes" serverName={serverName as string} slides={themes ?? []} />
        </section>
        <section className={styles.CallToAction}>
          <CallToAction />
        </section>
      </main>
    </div>
  );
}
