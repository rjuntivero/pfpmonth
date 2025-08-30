import Avatar from '@/components/shared/Avatar/Avatar';
import styles from './SuggestionDetails.module.css';
import Image from 'next/image';

interface Props {
  themeName: string;
  themeVotes?: number;
  themeDescription?: string;
  themeCreator: {
    avatar_url?: string;
    username?: string;
  };
}

export default function SuggestionDetails({ themeName, themeVotes, themeDescription, themeCreator }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.author}>
          <div className={styles.avatarWrapper}>
            <Avatar className={styles.avatar} imageURL={themeCreator.avatar_url ?? './no-image-placeholder.jpg'} />
            <p className={styles.authorName}>{themeCreator.username}</p>
          </div>
        </div>
        <div className={styles.details}>
          <h1 className={styles.themeName}>{themeName}</h1>
          <p className={styles.descriptionHeader}>Description:</p>
          <p className={styles.themeDescription}>
            {`"`}
            {themeDescription ?? 'No description'}
            {`"`}
          </p>
          <p className={styles.themeVotes}>
            {themeVotes} {themeVotes === 1 ? 'vote' : 'votes'}
          </p>
        </div>
      </div>
    </div>
  );
}
