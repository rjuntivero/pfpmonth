'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/state/store';
import { setSelectedCharacterName } from '@/features/profileSlice';
import ProfilePanel from '../ProfilePanel/ProfilePanel';
import CharacterCard from '@/components/profile/CharacterPanel/CharacterCard';
import styles from './CharacterPanel.module.css';
import { Character } from '@/types/Character';
import { useEffect } from 'react';
import Dropdown from '@/components/shared/Dropdown/Dropdown';
import Searchbar from '@/components/shared/Searchbar/Searchbar';

interface Props {
  characters: Character[] | undefined;
}

const dummyCharacters: Character[] = [
  {
    name: 'Alice Wonderland',
    id: '1',
    theme_id: 'theme1',
    user_id: 'user1',
    image_url: '/images/alice.jpg',
  },
  {
    name: 'Bob Builder',
    id: '2',
    theme_id: 'theme1',
    user_id: 'user2',
    image_url: '/images/bob.jpg',
  },
  {
    name: 'Charlie Chaplin',
    id: '3',
    theme_id: 'theme2',
    user_id: 'user3',
    image_url: '/images/charlie.jpg',
  },
  {
    name: 'Dora Explorer',
    id: '4',
    theme_id: 'theme2',
    user_id: 'user4',
    image_url: '/images/dora.jpg',
  },
  {
    name: 'Eve Online',
    id: '5',
    theme_id: 'theme3',
    user_id: 'user5',
    image_url: '/images/eve.jpg',
  },
];

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
        <Searchbar characters={dummyCharacters} />
        <div className={styles.characters}>
          {characters?.map((character) => (
            <CharacterCard
              key={character.name}
              selected={character.name === selectedCharacter?.name}
              onClick={() => dispatch(setSelectedCharacterName(character))}
              imageURL={character.image_url || '/no-image-placeholder.jpg'}
              characterName={character.name}
            />
          ))}
        </div>
      </div>
      <div className={styles.addCharacter}></div>
    </ProfilePanel>
  );
}
