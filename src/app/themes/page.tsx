import ThemeBackground from '@/components/Theme/ThemeBackground/ThemeBackground';
import styles from './page.module.css';
import Image from 'next/image';
import ThemeSlider from '@/components/Theme/ThemeSlider/ThemeSlider';
import { fetchThemesAndServer } from '@/utils/fetchThemes';
import { CurtainDrapes } from '@/components/CurtainDrapes/CurtainDrapes';

export default async function Page() {
  const { themes } = await fetchThemesAndServer();
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.heading}>
          <ThemeBackground themeId="adventure" wrapperClassName={styles.backgroundWrapper} imageClassName={styles.image} />
          <Image src="/chasm2.svg" alt="title container" width={1440} height={379} className={styles.titleWrapper} />
          <div className={styles.title}>
            <h2>barbz</h2>
            <h1>THEMES</h1>
          </div>
        </div>
        <div className={styles.themes}>
          <CurtainDrapes />

          <Image src="/curtainsTop.svg" alt="curtain top container" width={1472} height={36} className={styles.curtainsTop} />
          <div className={styles.details}>
            <h1 className={styles.year}>2025</h1>
          </div>
          <ThemeSlider themes={themes} display="none" />
        </div>
      </main>
    </div>
  );
}
