import TrendingThemes from '@/components/Theme/TrendingThemes/TrendingThemes';
import styles from './page.module.css';
import CallToAction from '@/components/CallToAction/CallToAction';
import ThemeSlider from '@/components/Theme/ThemeSlider/ThemeSlider';
import { createClient } from '@/utils/supabaseSSR';

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch serverName
  const { data: userServer } = await supabase.from('user_servers').select('server_id, servers (name)').eq('user_id', user?.id).maybeSingle();
  const serverName = userServer?.servers!.name;

  // Fetch themes
  const serverId = userServer?.server_id;
  const { data: themes } = await supabase.from('themes').select('*').eq('server_id', serverId).order('start_date', { ascending: true });

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
