import Image from 'next/image';
import styles from './SuggestionPage.module.css';
import ThemeBackground from '@/components/theme/ThemeBackground/ThemeBackground';
// import Feedback from '@/components/shared/LikeButton/LikeButton';
// import { fetchThemeData } from '@/lib/api/theme/fetchTheme';
import ConfirmModal from '@/components/shared/Modal/ConfirmModal/ConfirmModal';
import ButtonModalWrapper from '@/components/wrappers/ButtonModalWrapper/ButtonModalWrapper';
import { fetchPolLData } from '@/lib/api/poll/fetchPollData';

interface Props {
  suggestionId: string;
  themeMonth: string;
}

export default async function SuggestionPage({ suggestionId, themeMonth }: Props) {
  const suggestion = await fetchPolLData(suggestionId);
  console.log('SuggestionPage suggestion:', suggestion);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ThemeBackground themeImage={suggestion.image_url || '/no-image-placeholder.jpg'} wrapperClassName={styles.backgroundWrapper} imageClassName={styles.image} />
        <div className={styles.fadeOverlay} />

        <div className={styles.frameWrapper}>
          <Image src="/ThemeFrame.svg" alt="Theme Frame" fill priority={true} className={styles.frame} />
        </div>

        <div className={styles.title}>
          <h2>Suggestion</h2>
          <h1>{suggestion.name || 'null'}</h1>
          <div className={styles.reviews}></div>
          <p className={styles.comment}>{`"${suggestion.option_text}"` || 'No description'}</p>
          <div>
            <ButtonModalWrapper modalClassName="confirmModal" buttonText="Confirm Theme?">
              <ConfirmModal poll={suggestion} themeMonth={themeMonth} />
            </ButtonModalWrapper>
          </div>
        </div>
        <section className={styles.userDetails}>
          <section className={styles.author}>
            <div className={styles.authorAvatar}>
              <Image src={suggestion.created_by_user?.avatar_url || '/no-image-placeholder.jpg'} alt="Theme Frame" fill className={styles.avatar} />
            </div>
            <p className={styles.authorName}>Suggested by {suggestion.created_by_user?.username}</p>
          </section>
          <section className={styles.participants}>
            <div className={styles.users}></div>
          </section>
          <section className={styles.stats}></section>
        </section>
      </main>
    </div>
  );
}
