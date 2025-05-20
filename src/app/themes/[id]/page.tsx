import Image from 'next/image';
import styles from './page.module.css';
import ThemeBackground from '@/components/ui/Theme/ThemeBackground/ThemeBackground';
import Figure from '@/components/ui/Figure/Figure';
import User from '@/components/ui/User/User';
import Feedback from '@/components/ui/LikeButton/LikeButton';
import { fetchThemeData } from '@/lib/fetchTheme';
import JoinThemeWrapper from '@/components/Wrappers/JoinThemeWrapper/JoinThemeWrapper';

export default async function Page({ params }: { params: { id: string } }) {
  const themeData = await fetchThemeData({ themeId: params.id });
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ThemeBackground themeImage={themeData.theme?.image_url} wrapperClassName={styles.backgroundWrapper} imageClassName={styles.image} />
        <div className={styles.fadeOverlay} />

        <div className={styles.frameWrapper}>
          <Image src="/ThemeFrame.svg" alt="Theme Frame" fill priority className={styles.frame} />
        </div>

        <div className={styles.title}>
          <h2>Theme</h2>
          <h1>{themeData.theme?.name || 'null'}</h1>
          <JoinThemeWrapper />
          <div className={styles.reviews}>
            <button className={`${styles.dislikesBtn} ${styles.btn}`}>
              <Feedback color={'#d9d9d9'} />
            </button>
            <button className={`${styles.likesBtn} ${styles.btn}`}>
              <Feedback color={'#d9d9d9'} />
            </button>
          </div>
          <p className={styles.comment}>
            {'"'} {themeData.theme?.description} {'"'}
          </p>
        </div>
        <section className={styles.userDetails}>
          <section className={styles.author}>
            <div className={styles.authorAvatar}>
              <Image src={themeData.theme?.created_by.avatar_url || '/no-image-placeholder.jpg'} alt="Theme Frame" fill className={styles.avatar} />
            </div>
            <p className={styles.authorName}>Suggested by {themeData.theme?.created_by.username}</p>
          </section>
          <section className={styles.participants}>
            <h1>{themeData.theme?.participants.length} users participated:</h1>
            <div className={styles.users}>
              {themeData.theme?.participants.map((participant, i) => (
                <User key={`${participant.username}-${i}`} character={participant.character_name} />
              ))}
            </div>
          </section>
          <section className={styles.stats}>
            <Figure />
            <Figure />
            <Figure />
          </section>
        </section>
      </main>
    </div>
  );
}
