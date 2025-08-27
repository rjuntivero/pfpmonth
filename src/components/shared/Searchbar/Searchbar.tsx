'use client';

import { useState, useEffect } from 'react';
import styles from './Searchbar.module.css';
import Button from '@/components/shared/Button/Button';
import { Character } from '@/types/Character';

interface Props {
  characters: Character[];
  onSelect?: (character: Character) => void;
}

export default function Searchbar({ characters, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState<Character[]>([]);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const filtered = characters.filter((char) => char.name.toLowerCase().includes(query.toLowerCase()));
    setFilteredResults(filtered);
  }, [query, characters]);

  return (
    <div className={styles.container}>
      <form onSubmit={(e) => e.preventDefault()}>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 150)} placeholder="Search for a Character..." />
      </form>

      <div className={`${styles.resultsWrapper} ${focused ? styles.show : ''}`}>
        <ul className={styles.results}>
          {filteredResults.length > 0 ? (
            filteredResults.map((char, i) => (
              <li key={i}>
                <Button variant="character-result" className={`${styles.searchItem} `} onClick={() => onSelect?.(char)}>
                  {char.name}
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
