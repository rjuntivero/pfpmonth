'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/state/store';
import { setLoading, setSelectedCharacterName } from '@/features/profileSlice';
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

// const dummyCharacters: Character[] = [
//   {
//     name: 'Alice Wonderland',
//     id: '1',
//     theme_id: 'theme1',
//     user_id: 'user1',
//     image_url: '/images/alice.jpg',
//   },
//   {
//     name: 'Bob Builder',
//     id: '2',
//     theme_id: 'theme1',
//     user_id: 'user2',
//     image_url: '/images/bob.jpg',
//   },
//   {
//     name: 'Charlie Chaplin',
//     id: '3',
//     theme_id: 'theme2',
//     user_id: 'user3',
//     image_url: '/images/charlie.jpg',
//   },
//   {
//     name: 'Dora Explorer',
//     id: '4',
//     theme_id: 'theme2',
//     user_id: 'user4',
//     image_url: '/images/dora.jpg',
//   },
//   {
//     name: 'Eve Online',
//     id: '5',
//     theme_id: 'theme3',
//     user_id: 'user5',
//     image_url: '/images/eve.jpg',
//   },
// ];

export default function CharacterPanel({ characters }: Props) {
  const dispatch = useDispatch();
  const selectedCharacter = useSelector((state: RootState) => state.profile.selectedCharacter);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const loading = useAppSelector((state) => state.profile.loading);

  useEffect(() => {
    if (characters?.length) {
      setFilteredCharacters(characters);
      if (!selectedCharacter) {
        dispatch(setSelectedCharacterName(characters[0]));
      }
      dispatch(setLoading(false));
    } else {
      dispatch(setLoading(true));
    }
  }, [characters, dispatch]);

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
          <Dropdown selected="2025" onSelect={(val) => console.log(val)} items={['2025', '2024', '2023']} />
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
