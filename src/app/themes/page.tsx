import ThemeBackground from '@/components/ui/Theme/ThemeBackground/ThemeBackground';
import styles from './page.module.css';
import Image from 'next/image';
import ThemeSlider from '@/components/ui/Theme/ThemeSlider/ThemeSlider';
import { fetchThemesAndServer } from '@/lib/fetchThemes';
import { CurtainDrapes } from '@/components/ui/CurtainDrapes/CurtainDrapes';

export default async function Page() {
  const { themes } = await fetchThemesAndServer();
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
          <div className={styles.details}>
            <button className={styles.yearNav}>{'<'}</button>
            <h1 className={styles.year}>2025</h1>
            <button className={styles.yearNav}>{'>'}</button>
          </div>
          <ThemeSlider slides={themes} display="none" monthClassName={styles.themesPage} />
        </div>
      </main>
    </div>
  );
}
