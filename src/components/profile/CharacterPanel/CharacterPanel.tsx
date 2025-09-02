'use client';

import { useDispatch } from 'react-redux';
import { setLoading, setSelectedCharacterName, setSelectedCharacterYear } from '@/features/profileSlice';
import ProfilePanel from '../ProfilePanel/ProfilePanel';
import CharacterCard from '@/components/profile/CharacterPanel/CharacterCard';
import styles from './CharacterPanel.module.css';
import { Character } from '@/types/Character';
import { useEffect, useState } from 'react';
import Dropdown from '@/components/shared/Dropdown/Dropdown';
import Searchbar from '@/components/shared/Searchbar/Searchbar';
import { useAppSelector } from '@/state/hooks';

interface Props {
  characters: Character[] | undefined;
}

export default function CharacterPanel({ characters }: Props) {
  const dispatch = useDispatch();
  const selectedCharacter = useAppSelector((state) => state.profile.selectedCharacter);
  const selectedCharacterYear = useAppSelector((state) => state.profile.selectedCharacterYear);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const loading = useAppSelector((state) => state.profile.loading);

  useEffect(() => {
    if (characters?.length) {
      setFilteredCharacters(characters);
      if (!selectedCharacter) {
        dispatch(setSelectedCharacterName(characters[0]));
      }
      dispatch(setLoading(false));
    }
  }, [characters, dispatch, selectedCharacter]);

  const handleSearch = (results: Character[], chosen?: Character) => {
    if (chosen) {
      dispatch(setSelectedCharacterName(chosen));
    }
    setFilteredCharacters(results);
  };

  return (
    <ProfilePanel
      heading="Characters"
      className={styles.characterPanel}
      contentClassName={styles.characterContent}
      headerAction={
        <>
          <Dropdown selected={selectedCharacterYear} onSelect={(val: string) => dispatch(setSelectedCharacterYear(val))} items={['2025', '2024', '2023']} />
        </>
      }
    >
      <div className={styles.content}>
        <Searchbar characters={characters ?? []} onSearch={handleSearch} />
        <div className={styles.characters}>
          {loading ? (
            <div className={styles.loaderWrapper}>
              <div className={styles.loader}></div>
            </div>
          ) : (
            filteredCharacters?.map((character) => (
              <CharacterCard
                key={character.name}
                selected={character.name === selectedCharacter?.name}
                onClick={() => dispatch(setSelectedCharacterName(character))}
                imageURL={character.image_url || '/no-image-placeholder.jpg'}
                characterName={character.name}
              />
            ))
          )}
        </div>
      </div>
      <div className={styles.addCharacter}></div>
    </ProfilePanel>
  );
}
