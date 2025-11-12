'use client';

import { useEffect, useState } from 'react';
import styles from './CharacterSearch.module.css';
import Button from '@/components/shared/Button/Button';
import { Character, ClaimedCharacter } from '@/types/Character';
import { useAppDispatch } from '@/state/hooks';
import { updateCharacterName } from '@/features/characterSlice';
interface Props {
  themeTitle?: string;
  themeId: string;
  claimedCharacter?: Character;
}

export default function CharacterSearch({ themeTitle, themeId, claimedCharacter }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ClaimedCharacter[]>([]);
  const [filteredResults, setFilteredResults] = useState<ClaimedCharacter[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const dispatch = useAppDispatch();

  // generate list of characters
  useEffect(() => {
    const fetchCharacters = async () => {
      if (!themeTitle) return;

      setLoading(true);

      try {
        const res = await fetch(
          `/api/themes/${themeId}/characters?theme=${encodeURIComponent(themeTitle)}`
        );
        const data = await res.json();

        if (res.ok && Array.isArray(data.characters)) {
          setResults(data.characters);
          setFilteredResults(data.characters);
        } else {
          setResults([]);
          setFilteredResults([]);
        }
      } catch (err) {
        console.error('Error fetching characters:', err);
        setResults([]);
        setFilteredResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [themeTitle, themeId]);

  // live update results as query changes
  useEffect(() => {
    const filtered = results.filter((character) =>
      character?.character_name?.toLowerCase()?.includes(query?.toLowerCase())
    );
    setFilteredResults(filtered);
  }, [query, results]);

  // handle character selection
  async function handleCharacterSelection(character: string) {
    dispatch(updateCharacterName({ themeId, name: character }));
    try {
      const res = await fetch('/api/user/character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ characterName: character, theme_id: themeId }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('Error updating character:', data.error);
      }
    } catch (error) {
      console.error('Error choosing character:', error);
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search for a Character..."
        />
      </form>

      <div className={`${styles.resultsWrapper} ${focused ? styles.show : ''}`}>
        <ul className={styles.results}>
          {loading ? (
            <li className={styles.loaderWrapper}>
              <div className={styles.loader}></div>
            </li>
          ) : filteredResults.length > 0 ? (
            filteredResults.map((char, i) => (
              <li key={i}>
                <Button
                  variant="character-result"
                  className={`${styles.searchItem} ${
                    char.character_name === claimedCharacter?.character_name ? styles.claimed : ''
                  }`}
                  disabled={char.character_name === claimedCharacter?.character_name}
                  onClick={() => handleCharacterSelection(char.character_name)}>
                  {char.character_name}
                </Button>
              </li>
            ))
          ) : (
            <li>No characters found</li>
          )}
        </ul>
      </div>
    </div>
  );
}
