import Image from 'next/image';
import styles from './ThemePage.module.css';
import ThemeBackground from '@/components/theme/ThemeBackground/ThemeBackground';
import User from '@/components/user/User';
import Feedback from '@/components/shared/LikeButton/LikeButton';
import { fetchThemeData } from '@/lib/api/theme/fetchThemeData';
import ButtonModalWrapper from '@/components/wrappers/ButtonModalWrapper/ButtonModalWrapper';
import JoinThemeModal from '@/components/shared/Modal/JoinThemeModal/JoinThemeModal';
import { Slide } from '@/types/Slide';
import Avatar from '@/components/user/Avatar/Avatar';
import fetchCharacter from '@/lib/api/user/characterActions';
// import Figure from '@/components/ui/Figure/Figure';
// import Avatar from '@/components/user/Avatar/Avatar';
// import fetchUser from '@/lib/api/user/fetchUser';
interface Props {
  theme: Slide;
  inPast?: boolean;
}

export default async function ThemePage({ theme, inPast }: Props) {
  const themeData = await fetchThemeData({ themeMonth: theme.theme_month });
  const character = await fetchCharacter(themeData.theme?.id);

  // const user = await fetchUser();
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ThemeBackground themeImage={themeData.theme?.image_url} wrapperClassName={styles.backgroundWrapper} imageClassName={styles.image} />
        <div className={styles.fadeOverlay} />

        <div className={styles.frameWrapper}>
          <Image src="/ThemeFrame.svg" alt="Theme Frame" fill priority={true} className={styles.frame} />
        </div>

        <div className={styles.title}>
          <h2>Theme</h2>
          <h1>{themeData.theme?.name || 'null'}</h1>
          {!inPast && (
            <ButtonModalWrapper buttonText="Join Theme" modalClassName="joinModal">
              <JoinThemeModal themeTitle={themeData?.theme?.name} themeId={themeData!.theme!.id} participants={themeData?.theme?.participants} username={themeData.theme?.created_by.username} chosenCharacter={character} />
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
          <p className={styles.comment}>{`"${themeData.theme?.description}"` || 'No Description'}</p>
        </div>
        <section className={styles.userDetails}>
          <section className={styles.author}>
            <div className={styles.authorAvatar}>
              <Avatar imageURL={themeData.theme?.created_by.avatar_url || '/no-image-placeholder.jpg'} className={styles.avatar} zoom={!themeData.theme?.created_by.avatar_url} />
            </div>
            <p className={styles.authorName}>created by {themeData.theme?.created_by.username}</p>
          </section>
          <section className={styles.participants}>
            <h1>{themeData.theme?.participants.length} participants:</h1>
            <div className={styles.users}>
              {themeData.theme?.participants.map((participant, i) => (
                <User key={`${participant.username}-${i}`} participant={participant} />
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
