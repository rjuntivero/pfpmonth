import Image from 'next/image';
import styles from './ThemePage.module.css';
import ThemeBackground from '@/components/theme/ThemeBackground/ThemeBackground';
import User from '@/components/user/User';
import Feedback from '@/components/shared/LikeButton/LikeButton';
import { fetchThemeData } from '@/lib/api/theme/fetchTheme';
import ButtonModalWrapper from '@/components/wrappers/ButtonModalWrapper/ButtonModalWrapper';
import { Theme } from '@/types/Theme';
import JoinThemeModal from '@/components/shared/Modal/JoinThemeModal/JoinThemeModal';
// import Figure from '@/components/ui/Figure/Figure';
// import Avatar from '@/components/user/Avatar/Avatar';
// import fetchUser from '@/lib/api/user/fetchUser';
interface Props {
  theme: Theme;
  inPast?: boolean;
}

export default async function ThemePage({ theme, inPast }: Props) {
  const themeData = await fetchThemeData({ themeMonth: theme.theme_month });

  // const user = await fetchUser();
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
          {!inPast && (
            <ButtonModalWrapper buttonText="Join Theme" modalClassName="joinModal">
              <JoinThemeModal themeTitle={themeData?.theme?.name} participants={themeData?.theme?.participants} username={themeData.theme?.created_by.username} characterName="No Character" />
            </ButtonModalWrapper>
          )}
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
            <p className={styles.authorName}>created by {themeData.theme?.created_by.username}</p>
          </section>
          <section className={styles.participants}>
            <h1>{themeData.theme?.participants.length} participants:</h1>
            <div className={styles.users}>
              {themeData.theme?.participants.map((participant, i) => (
                <User key={`${participant.username}-${i}`} character={participant.character_name} />
              ))}
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
