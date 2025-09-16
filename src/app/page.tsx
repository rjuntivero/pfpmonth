import TrendingThemes from '@/components/theme/TrendingThemes/TrendingThemes';
import styles from './page.module.css';
import CallToAction from '@/components/layout/CallToAction/CallToAction';
import { fetchThemes } from '@/lib/api/theme/fetchThemes';
import { cookies } from 'next/headers';
import { Metadata } from 'next';
import ThemeSliderClientWrapper from '@/components/wrappers/ThemeSliderClientWrapper/ThemeSliderClientWrapper';
import PollInitClientWrapper from '@/components/wrappers/PollInitClientWrapper/PollInitClientWrapper';
import { fetchServerPoll } from '@/lib/api/poll/fetchServerPoll';
import { fetchPollOptions } from '@/lib/api/poll/fetchPollOptions';
import { createClient } from '@/lib/supabase/supabaseSSR';

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
  const serverPoll = await fetchServerPoll(serverId as string);
  const { pollOptions } = await fetchPollOptions(serverPoll.id as string);
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  return (
    <div className={styles.page}>
      <PollInitClientWrapper polls={pollOptions} />
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
              <span className={styles.mo}>Mo</span>
              <span>n</span>
              <span className={styles.t}>t</span>
              <span>h</span>
            </h1>
            <p>Create Monthly Profile Themes for your Discord server</p>
          </header>
          <div className={styles.getStarted}>
            <h2>Pitch It. Pick It. PFP It.</h2>
            {/* <button className={styles.actionBtn} aria-label="Start creating profile themes for your Discord server">
              Get Started
            </button> */}
          </div>
        </div>
        <section aria-hidden="true">
          <TrendingThemes />
        </section>
        {user && (
          <section role="region" aria-label="Current Server Themes">
            <ThemeSliderClientWrapper serverName={serverName as string} serverId={serverId as string} initialYear={currentYear} initialThemes={themes} isHomePage={true} />
          </section>
        )}
        {/* <section className={styles.CallToAction}>
          <CallToAction />
        </section> */}
      </main>
    </div>
  );
}
