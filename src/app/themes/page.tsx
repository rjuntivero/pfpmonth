export const revalidate = 10;

import ThemeBackground from '@/components/ui/Theme/ThemeBackground/ThemeBackground';
import styles from './page.module.css';
import Image from 'next/image';
import { fetchThemesAndServer } from '@/lib/fetchThemes';
import { CurtainDrapes } from '@/components/ui/CurtainDrapes/CurtainDrapes';
import ThemeSliderClientWrapper from '@/components/Wrappers/ThemeSliderClientWrapper/ThemeSliderClientWrapper';
import { cookies } from 'next/headers';

export default async function Page() {
  const currentYear = new Date().getFullYear();
  const serverId = (await cookies()).get('server_id')?.value;
  const { themes } = await fetchThemesAndServer(currentYear, serverId);
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.heading}>
          <ThemeBackground wrapperClassName={styles.backgroundWrapper} imageClassName={styles.image} />
          <Image src="/chasm2.svg" alt="title container" width={1440} height={379} className={styles.titleWrapper} />
          <div className={styles.title}>
            <h2>barbz</h2>
            <h1>THEMES</h1>
          </div>
        </div>
        <div className={styles.themes}>
          <CurtainDrapes />
          <Image src="/curtainsTop.svg" alt="curtain top container" width={1472} height={36} className={styles.curtainsTop} />
          <ThemeSliderClientWrapper initialYear={currentYear} initialSlides={themes} initialRender={false} serverId={serverId as string} />
        </div>
      </main>
    </div>
  );
}
