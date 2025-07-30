'use client';

import styles from './JoinThemeModal.module.css';
import Avatar from '@/components/user/Avatar/Avatar';
import CharacterSearch from '@/components/character/CharacterSearch/CharacterSearch';
import { Participant } from '@/types/Participant';
import User from '@/components/user/User';
import { useEffect, useState } from 'react';
import { Character } from '@/types/Character';

interface Props {
  themeTitle?: string;
  themeId: string;
  participants?: Participant[] | undefined;
  username?: string;
  chosenCharacter?: Character;
}

export default function JoinThemeModal({ themeTitle, themeId, participants, username, chosenCharacter }: Props) {
  const [characterName, setCharacterName] = useState<string | 'No Character'>('No Character');
  const [characterImage, setCharacterImage] = useState<string | '/no-image-placeholder.jpg'>(chosenCharacter?.image_url || '/no-image-placeholder.jpg');

  // change character image
  function handleImageChange(file: File) {
    const url = URL.createObjectURL(file);
    setCharacterImage(url);
  }

  return (
    <>
      <div className={styles.modalWrapper}>
        {/* <h1 className={styles.themeTitle}>{themeTitle}</h1> */}
        <div className={styles.content}>
          <div className={styles.actions}>
            <Avatar editable={true} onImageChange={handleImageChange} imageURL={characterImage} className={styles.avatar} zoom={true} />
            <h2 className={styles.username}>{username}</h2>
            <h2 className={styles.characterName}>{chosenCharacter?.characterName}</h2>
            <CharacterSearch themeTitle={themeTitle} themeId={themeId} setChosenCharacter={setCharacterName} />
            <article className={styles.manualSearch}>
              <p>or... Enter manually</p>
              {/* <form action="" onSubmit={(e) => e.preventDefault()}>
                <input type="text" className={styles.searchBar} />
                <button>Submit</button>
              </form> */}
            </article>
          </div>
          <div className={styles.participants}>
            <h1 className={styles.participantTitle}>Claimed Characters</h1>
            {participants && participants?.length > 0 ? participants?.map((participant) => <User participant={participant} key={participant.character_name} />) : 'No current participants'}
          </div>
        </div>
      </div>
    </>
  );
}
