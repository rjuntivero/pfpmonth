'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/state/store';
import { setSelectedCharacterName } from '@/features/profileSlice';
import ProfilePanel from '../ProfilePanel/ProfilePanel';
import CharacterCard from '@/components/profile/CharacterPanel/CharacterCard';
import styles from './CharacterPanel.module.css';
import { Character } from '@/types/Character';
import { useEffect } from 'react';

interface Props {
  characters: Character[] | undefined;
}

export default function CharacterPanel({ characters }: Props) {
  const dispatch = useDispatch();
  const selectedCharacter = useSelector((state: RootState) => state.profile.selectedCharacter);

  useEffect(() => {
    if (!selectedCharacter && characters) {
      if (characters?.length > 0) {
        dispatch(setSelectedCharacterName(characters[0]));
      }
    }
  }, [dispatch, selectedCharacter, characters]);

  return (
    <ProfilePanel heading="Characters" className={styles.characterPanel} contentClassName={styles.characterContent}>
      {characters?.map((character) => (
        <CharacterCard
          key={character.name}
          selected={character.name === selectedCharacter?.name}
          onClick={() => dispatch(setSelectedCharacterName(character))}
          imageURL={character.image_url || '/no-image-placeholder.jpg'}
          characterName={character.name}
        />
      ))}
      <div className={styles.addCharacter}></div>
    </ProfilePanel>
  );
}
