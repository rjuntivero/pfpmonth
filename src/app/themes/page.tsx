import styles from './page.module.css';
import Image from 'next/image';
import { fetchThemes } from '@/lib/api/theme/fetchThemes';
import { CurtainDrapes } from '@/components/theme/CurtainDrapes/CurtainDrapes';
import ThemeSliderClientWrapper from '@/components/wrappers/ThemeSliderClientWrapper/ThemeSliderClientWrapper';
import { cookies } from 'next/headers';
import ThemeOverviewPanel from '@/components/layout/ThemeOverviewPanel/ThemeOverviewPanel';
import { requireAuth } from '@/lib/auth/requireAuth';
import { fetchServer } from '@/lib/api/server/fetchServer';
import ThemeSliderBackdrop from '@/components/theme/ThemeSliderBackdrop/ThemeSliderBackdrop';
import PollButton from '@/components/poll/PollButton/PollButton';

export default async function Page() {
  const currentYear = new Date().getFullYear();
  const serverId = (await cookies()).get('server_id')?.value;
  const server = await fetchServer();
  const { themes } = await fetchThemes(currentYear, serverId);

  // ensure user is authenticated
  await requireAuth();

  return (
    <div className={styles.page}>
      <PollButton />

      <main className={styles.main}>
        <div className={styles.heading}>
          <ThemeSliderBackdrop wrapperClassName={styles.backgroundWrapper} imageClassName={styles.image} />
          {/* <Image src="/chasm2.svg" alt="title container" width={1440} height={379} className={styles.titleWrapper} priority={true} /> */}
          <div className={styles.titleContainer}>
            <div className={styles.title}>
              <h2>{server?.name}</h2>
              <h1>THEMES</h1>
            </div>
          </div>
        </div>
        <div className={styles.themes}>
          <CurtainDrapes />
          <Image src="/curtainsTop.svg" alt="curtain top container" width={1472} height={36} className={styles.curtainsTop} />
          <ThemeSliderClientWrapper serverId={serverId as string} initialYear={currentYear} initialThemes={themes} />
        </div>
      </main>
      <ThemeOverviewPanel serverId={serverId as string} />
    </div>
  );
}
