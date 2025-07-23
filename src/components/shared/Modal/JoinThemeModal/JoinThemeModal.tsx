'use client';

import styles from './JoinThemeModal.module.css';
import Avatar from '@/components/user/Avatar/Avatar';
import CharacterSearch from '@/components/character/CharacterSearch/CharacterSearch';
import { Participant } from '@/types/Participant';
import User from '@/components/user/User';

interface Props {
  themeTitle?: string;
  participants?: Participant[] | undefined;
  username?: string;
  characterName?: string;
}

export default function JoinThemeModal({ themeTitle, participants, username, characterName }: Props) {
  return (
    <>
      <div className={styles.modalWrapper}>
        <h1 className={styles.themeTitle}>{themeTitle}</h1>
        <div className={styles.content}>
          <div className={styles.actions}>
            <Avatar imageURL={'/no-image-placeholder.jpg'} className={styles.avatar} />
            <h2 className={styles.username}>{username}</h2>
            <h2 className={styles.characterName}>{characterName}</h2>
            <CharacterSearch themeTitle={themeTitle} />
            <p>Unlisted Character? Enter it manually</p>
            <input type="text" />
          </div>
          <div className={styles.participants}>
            <h1 className={styles.participantTitle}>Claimed Characters</h1>
            {participants && participants?.length > 0 ? participants?.map((participant) => <User character={participant.name} key={participant.name} />) : 'No current participants'}
          </div>
        </div>
      </div>
    </>
  );
}
