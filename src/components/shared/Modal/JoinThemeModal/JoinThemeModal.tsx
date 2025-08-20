'use client';

import styles from './JoinThemeModal.module.css';
import Avatar from '@/components/user/Avatar/Avatar';
import CharacterSearch from '@/components/character/CharacterSearch/CharacterSearch';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { updateCharacterImage } from '@/features/characterSlice';
import ParticipantList from '@/components/theme/ParticipantList/ParticipantList';

interface Props {
  themeTitle?: string;
  themeId: string;
  username?: string;
}

export default function JoinThemeModal({ themeTitle, themeId, username }: Props) {
  const character = useAppSelector((state) => state.character.chosenCharacter[themeId]) || {
    name: 'No Character',
    image_url: '/no-image-placeholder.jpg',
  };

  const dispatch = useAppDispatch();

  // change character image
  async function handleImageChange(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Data = (reader.result as string).split(',')[1];

      const previewUrl = reader.result as string;

      // ui image preview
      dispatch(updateCharacterImage({ themeId, image_url: previewUrl }));

      const res = await fetch('/api/user/character/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeId,
          fileBase64: base64Data,
          fileName: file.name,
          name: character.name,
        }),
      });

      const data = await res.json();

      if (data.success && data.character) {
        dispatch(updateCharacterImage({ themeId, image_url: data.character.image_url }));
      } else {
        console.error('Failed to upload character image', data.error);
      }
    };
    reader.onerror = (error) => {
      console.error('File reading error:', error);
    };
  }

  return (
    <>
      <div className={styles.modalWrapper}>
        {/* <h1 className={styles.themeTitle}>{themeTitle}</h1> */}
        <div className={styles.content}>
          <div className={styles.actions}>
            <Avatar editable={true} onImageChange={handleImageChange} imageURL={character.image_url || '/no-image-placeholder.jpg'} className={styles.avatar} zoom={true} />
            <h2 className={styles.username}>{username}</h2>
            <h2 className={styles.characterName}>{character.name}</h2>
            <CharacterSearch themeTitle={themeTitle} themeId={themeId} />
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
            <ParticipantList />
          </div>
        </div>
      </div>
    </>
  );
}
