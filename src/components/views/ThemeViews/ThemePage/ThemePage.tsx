import Image from 'next/image';
import styles from './ThemePage.module.css';
import ThemeBackground from '@/components/theme/ThemeBackground/ThemeBackground';
import { fetchThemeData } from '@/lib/api/theme/fetchThemeData';
import ButtonModalWrapper from '@/components/wrappers/ButtonModalWrapper/ButtonModalWrapper';
import JoinThemeModal from '@/components/shared/Modal/JoinThemeModal/JoinThemeModal';
import { Slide } from '@/types/Slide';
import Avatar from '@/components/shared/Avatar/Avatar';
import { fetchCharacter } from '@/lib/api/user/characterActions';
import CharacterInitClientWrapper from '@/components/wrappers/CharacterInitClientWrapper/CharacterInitClientWrapper';
import ParticipantList from '@/components/theme/ParticipantList/ParticipantList';

interface Props {
  theme: Slide;
  inPast?: boolean;
}

export default async function ThemePage({ theme, inPast }: Props) {
  const themeData = await fetchThemeData({ themeMonth: theme.theme_month });

  if (!themeData || 'error' in themeData) {
    return <div>Theme not found</div>;
  }

  const character = await fetchCharacter(themeData?.id);

  return (
    <div className={styles.page}>
      <CharacterInitClientWrapper character={character} />
      <main className={styles.main}>
        <ThemeBackground
          themeImage={themeData?.image_url}
          wrapperClassName={styles.backgroundWrapper}
          imageClassName={styles.image}
        />
        <div className={styles.fadeOverlay} />

        <div className={styles.frameWrapper}>
          <Image
            src="/ThemeFrame.svg"
            alt="Theme Frame"
            fill
            priority={true}
            className={styles.frame}
          />
        </div>

        <div className={styles.title}>
          <h2>Theme</h2>
          <h1>{themeData?.name || 'null'}</h1>
          {!inPast && (
            <ButtonModalWrapper buttonText="Join Theme" modalClassName="joinModal">
              <JoinThemeModal
                themeTitle={themeData?.name}
                themeId={themeData!.id}
                username={themeData?.created_by.username}
              />
            </ButtonModalWrapper>
          )}
          <div className={styles.reviews}></div>
          <p className={styles.comment}>{`"${themeData?.description}"` || 'No Description'}</p>
        </div>
        <section className={styles.userDetails}>
          <section className={styles.author}>
            <div className={styles.authorAvatar}>
              <Avatar
                imageURL={themeData?.created_by.avatar_url || '/no-image-placeholder.jpg'}
                className={styles.avatar}
                zoom={!themeData?.created_by.avatar_url}
              />
            </div>
            <p className={styles.authorName}>created by {themeData?.created_by.username}</p>
          </section>
          <section className={styles.participants}>
            <h1>{themeData?.participants.length} participants:</h1>
            <div className={styles.users}>
              <ParticipantList themeId={theme.id!} />
            </div>
          </section>
          <section className={styles.stats}></section>
        </section>
      </main>
    </div>
  );
}
