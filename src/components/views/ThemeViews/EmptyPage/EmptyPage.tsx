import Image from 'next/image';
import styles from './EmptyPage.module.css';
import ThemeBackground from '@/components/theme/ThemeBackground/ThemeBackground';
import Button from '@/components/shared/Button/Button';
// import Feedback from '@/components/ui/LikeButton/LikeButton';
// import JoinThemeWrapper from '@/components/Wrappers/JoinThemeWrapper/JoinThemeWrapper';

export default async function EmptyPage({ slug }: { slug: string }) {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ThemeBackground themeImage={'/none.jpg'} wrapperClassName={styles.backgroundWrapper} imageClassName={styles.image} />
        <div className={styles.fadeOverlay} />

        <div className={styles.frameWrapper}>
          <Image src="/ThemeFrame.svg" alt="Theme Frame" fill priority className={styles.frame} />
        </div>

        <div className={styles.title}>
          <h2>{slug}</h2>
          <h1>{'No Theme'}</h1>
          {/* <JoinThemeWrapper /> */}
          <p className={styles.comment}>
            {'"'}Masky compels you to come up with a theme! {'"'}
          </p>
          <div className={styles.reviews}>
            <Button>Upload Theme</Button>
          </div>
        </div>
        <section className={styles.userDetails}>
          <section className={styles.author}>
            <div className={styles.authorAvatar}>
              <Image src={'/no-image-placeholder.jpg'} alt="Theme Frame" fill className={styles.avatar} />
            </div>
            <p className={styles.authorName}>{'Masky'}</p>
          </section>
          <section className={styles.participants}>
            {/* <h1>{themeData.theme?.participants.length} users participated:</h1> */}
            <div className={styles.users}>
              {/* {themeData.theme?.participants.map((participant, i) => (
                <User key={`${participant.username}-${i}`} character={participant.character_name} />
              ))} */}
            </div>
          </section>
          <section className={styles.stats}>
            {/* <Figure />
            <Figure />
            <Figure /> */}
          </section>
        </section>
      </main>
    </div>
  );
}
