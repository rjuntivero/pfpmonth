'use client';

import { useState, useEffect } from 'react';
import styles from './Searchbar.module.css';
import Button from '@/components/shared/Button/Button';
import { Character } from '@/types/Character';

interface Props {
  characters: Character[];
  onSearch?: (results: Character[], chosen?: Character) => void;
}

export default function Searchbar({ characters, onSearch }: Props) {
  const [query, setQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState<Character[]>([]);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredResults(characters);
      onSearch?.(characters);
      return;
    }

    const filtered = characters.filter((char) => char.name.toLowerCase().includes(query.toLowerCase()));
    setFilteredResults(filtered);
    onSearch?.(filtered);
  }, [query, characters]);

  const handleSelect = (char: Character) => {
    setQuery(char.name);
    setFilteredResults([char]);
    onSearch?.([char], char);
    setFocused(false);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={(e) => e.preventDefault()}>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 150)} placeholder="Search for a Character..." />
      </form>

      <div className={`${styles.resultsWrapper} ${focused ? styles.show : ''}`}>
        <ul className={styles.results}>
          {filteredResults.length > 0 ? (
            filteredResults.map((char) => (
              <li key={char.id}>
                <Button variant="character-result" className={`${styles.searchItem} `} onClick={() => handleSelect(char)}>
                  {char.name}
                </Button>
              </li>
            ))
          ) : (
            <></>
          )}
        </ul>
      </div>
    </div>
  );
}
