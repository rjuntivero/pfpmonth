'use client';

import { useEffect, useState } from 'react';
import styles from './CharacterSearch.module.css';
import Button from '@/components/shared/Button/Button';

interface Props {
  themeTitle?: string;
  themeId: string;
  setChosenCharacter: (character: string) => void;
}

export default function CharacterSearch({ themeTitle, themeId, setChosenCharacter }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [filteredResults, setFilteredResults] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);

  //generate list of characters
  useEffect(() => {
    const fetchCharacters = async () => {
      if (!themeTitle) return;

      setLoading(true);

      const res = await fetch(`/api/characters?theme=${encodeURIComponent(themeTitle)}`);
      const data = await res.json();

      if (res.ok) {
        setResults(data.characters);
        setFilteredResults(data.characters);
      } else {
        console.error('Error fetching characters:', data.error);
      }

      setLoading(false);
    };

    fetchCharacters();
  }, [themeTitle]);

  // Live update results as query changes
  useEffect(() => {
    const filtered = results.filter((character) => character.toLowerCase().includes(query.toLowerCase()));
    setFilteredResults(filtered);
  }, [query, results]);

  // handle character selection
  async function handleCharacterSelection(character: string) {
    setChosenCharacter(character);
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
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 150)} placeholder="Search for a Character..." />
      </form>

      <div className={`${styles.resultsWrapper} ${focused ? styles.show : ''}`}>
        <ul className={`${styles.results}`}>
          {filteredResults.map((item, i) => (
            <li key={i} onClick={() => handleCharacterSelection(item)}>
              <Button variant="character-result" className={styles.searchItem}>
                {item}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
