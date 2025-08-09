'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/state/store';
import { setSelectedCharacterName } from '@/features/profileSlice';
import ProfilePanel from '../ProfilePanel/ProfilePanel';
import CharacterCard from '@/components/character/CharacterCard/CharacterCard';
import styles from './CharacterPanel.module.css';
import { Character } from '@/types/Character';

interface Props {
  characters: Character[] | undefined;
}

export default function CharacterPanel({ characters }: Props) {
  const dispatch = useDispatch();
  const selectedCharacterName = useSelector((state: RootState) => state.profile.selectedCharacterName);

  return (
    <ProfilePanel heading="Characters" className={styles.characterPanel} contentClassName={styles.characterContent}>
      {characters?.map((character) => (
        <CharacterCard
          key={character.name}
          selected={character.name === selectedCharacterName}
          onClick={() => dispatch(setSelectedCharacterName(character.name))}
          imageURL={character.image_url || '/no-image-placeholder.jpg'}
          characterName={character.name}
        />
      ))}
      <div className={styles.addCharacter}></div>
    </ProfilePanel>
  );
}
