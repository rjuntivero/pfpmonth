'use client';

import { useEffect, useState } from 'react';
import styles from './CharacterSearch.module.css';
import Button from '@/components/shared/Button/Button';

export default function CharacterSearch({ themeTitle }: { themeTitle?: string }) {
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

  //search through cached character list
  // const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const filtered = results.filter((character) => {
  //     return character.toLowerCase().includes(query.toLowerCase());
  //   });
  //   setFilteredResults(filtered);
  // };

  // Live update results as query changes
  useEffect(() => {
    const filtered = results.filter((character) => character.toLowerCase().includes(query.toLowerCase()));
    setFilteredResults(filtered);
  }, [query, results]);

  return (
    <div className={styles.container}>
      <form onSubmit={(e) => e.preventDefault()}>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 150)} placeholder="Search for a Character..." />
      </form>

      <div className={`${styles.resultsWrapper} ${focused ? styles.show : ''}`}>
        <ul className={`${styles.results}`}>
          {filteredResults.map((item, i) => (
            <li key={i}>
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
