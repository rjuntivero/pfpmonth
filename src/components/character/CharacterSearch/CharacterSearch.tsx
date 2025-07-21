'use client';

import { useEffect, useState } from 'react';
import styles from './CharacterSearch.module.css';
import Button from '@/components/shared/Button/Button';

export default function CharacterSearch({ themeTitle }: { themeTitle?: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [filteredResults, setFilteredResults] = useState<string[]>([]);

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
  const handleSearch = async (e) => {
    e.preventDefault();
    const filtered = results.filter((character) => {
      return character.toLowerCase().includes(query.toLowerCase());
    });
    setFilteredResults(filtered);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSearch}>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for a Character..." />
        <button disabled={loading}>{loading ? 'Searching…' : 'Search'}</button>
      </form>

      <ul className={styles.results}>
        {filteredResults.map((item, i) => (
          <li key={i}>
            <Button variant="character-result">{item}</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
