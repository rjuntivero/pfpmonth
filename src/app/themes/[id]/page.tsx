import Image from 'next/image';
import styles from './page.module.css';
import ThemeBackground from '@/components/ThemeBackground/ThemeBackground';
import Figure from '@/components/Figure/Figure';
import User from '@/components/User/User';

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ThemeBackground themeId={params.id} />
        <div className={styles.fadeOverlay} />

        <div className={styles.frameWrapper}>
          <Image src="/ThemeFrame.svg" alt="Theme Frame" fill priority className={styles.frame} />
        </div>
        <div className={styles.details}>
          <button className={styles.joinBtn}>Join Theme</button>
          <h1 className={styles.date}>May</h1>
          <button className={styles.likesBtn}>likes</button>
          <button className={styles.dislikesBtn}>dislikes</button>
        </div>
        <div className={styles.title}>
          <h2>Theme</h2>
          <h1>{params.id}</h1>
        </div>
        <div className={styles.author}>
          <div className={styles.authorAvatar}>
            <Image src="/sinners.jpg" alt="Theme Frame" fill />
          </div>
          <p className={styles.authorName}>authorName says...</p>
          <p className={styles.comment}>
            {'"'} Idk wtf this means but sure {'"'}
          </p>
        </div>
        <section className={styles.participants}>
          <h1>7 current participants:</h1>
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
