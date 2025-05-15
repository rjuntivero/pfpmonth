import Image from 'next/image';
import styles from './page.module.css';
import ThemeBackground from '@/components/Theme/ThemeBackground/ThemeBackground';
import Figure from '@/components/Figure/Figure';
import User from '@/components/User/User';
import Feedback from '@/components/Feedback/Feedback';

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ThemeBackground themeId={params.id} wrapperClassName={styles.backgroundWrapper} imageClassName={styles.image} />
        <div className={styles.fadeOverlay} />

        <div className={styles.frameWrapper}>
          <Image src="/ThemeFrame.svg" alt="Theme Frame" fill priority className={styles.frame} />
        </div>

        <div className={styles.title}>
          {/* <h2 className={styles.date}>
            May <span>2025</span>
          </h2> */}
          <h2>Theme</h2>
          <h1>{params.id}</h1>
          <button className={styles.joinBtn}>Join Theme</button>
          <div className={styles.reviews}>
            <button className={`${styles.dislikesBtn} ${styles.btn}`}>
              <Feedback color={'#d9d9d9'} />
            </button>
            <button className={`${styles.likesBtn} ${styles.btn}`}>
              <Feedback color={'#d9d9d9'} />
            </button>
          </div>
        </div>
        <div className={styles.author}>
          <div className={styles.authorAvatar}>
            <Image src="/profile.webp" alt="Theme Frame" fill className={styles.avatar} />
          </div>
          <p className={styles.authorName}>authorName says...</p>
          <p className={styles.comment}>
            {'"'} Idk wtf this means but sure {'"'}
          </p>
        </div>

        <section className={styles.participants}>
          <h1>6 current participants:</h1>
          <div className={styles.users}>
            <User />
            <User />
            <User />
            <User />
            <User />
            <User />
          </div>
        </section>
        <section className={styles.stats}>
          <Figure />
          <Figure />
          <Figure />
        </section>
      </main>
    </div>
  );
}
