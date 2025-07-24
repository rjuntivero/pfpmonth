import Image from 'next/image';
import styles from './SuggestionPage.module.css';
import ThemeBackground from '@/components/theme/ThemeBackground/ThemeBackground';
// import Feedback from '@/components/shared/LikeButton/LikeButton';
// import { fetchThemeData } from '@/lib/api/theme/fetchTheme';
import ConfirmModal from '@/components/shared/Modal/ConfirmModal/ConfirmModal';
import ButtonModalWrapper from '@/components/wrappers/ButtonModalWrapper/ButtonModalWrapper';

export default async function SuggestionPage({ suggestion }: { suggestion: any }) {
  console.log('SuggestionPage suggestion:', suggestion);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ThemeBackground themeImage={suggestion.image_url || '/no-image-placeholder.jpg'} wrapperClassName={styles.backgroundWrapper} imageClassName={styles.image} />
        <div className={styles.fadeOverlay} />

        <div className={styles.frameWrapper}>
          <Image src="/ThemeFrame.svg" alt="Theme Frame" fill priority className={styles.frame} />
        </div>

        <div className={styles.title}>
          <h2>Suggestion</h2>
          <h1>{suggestion.name || 'null'}</h1>
          <div className={styles.reviews}></div>
          <p className={styles.comment}>
            {'"'} {'"'}
          </p>
          <div>
            <ButtonModalWrapper modalClassName="confirmModal" buttonText="Confirm Theme?">
              <ConfirmModal poll={suggestion} />
            </ButtonModalWrapper>
          </div>
        </div>
        <section className={styles.userDetails}>
          <section className={styles.author}>
            <div className={styles.authorAvatar}>
              <Image src={'/no-image-placeholder.jpg'} alt="Theme Frame" fill className={styles.avatar} />
            </div>
            <p className={styles.authorName}>Suggested by </p>
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
