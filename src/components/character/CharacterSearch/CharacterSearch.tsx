'use client';

import { useEffect, useState } from 'react';
import styles from './CharacterSearch.module.css';
import Button from '@/components/shared/Button/Button';

export default function CharacterSearch({ themeTitle }: { themeTitle?: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const characterList = [] as string[];

  //generate list of characters
  useEffect(() => {
    const fetchCharacters = async () => {
      if (!themeTitle) return;

      setLoading(true);

      const res = await fetch(`/api/characters?theme=${encodeURIComponent(themeTitle)}`);
      const data = await res.json();

      if (res.ok) {
        setResults(data.characters);
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
    return characterList.filter((character) => character.toLowerCase().includes(query.toLowerCase()));
  };

  // //retrieve cache

  // const cacheKey = `theme:${themeTitle?.toLowerCase()}`;

  // // try redis
  // let characters = await redis.get(cacheKey);
  // if (!characters) {
  //   // try supabase
  //   const supabase = createClient();
  //   const { data, error } = await supabase.from('characters').select('name').eq('theme', themeTitle?.toLowerCase()).single();

  //   if (data?.characters) {
  //   } else {
  //     characters = await generateCharacters();
  //     await redis.set(cacheKey, JSON.stringify(characters), 'EX', 60 * 60 * 24); // cache for 24 hours
  //     await supabase.from('character_cache').insert({
  //       theme: themeTitle?.toLowerCase(),
  //       characters,
  //     });
  //   }
  // }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSearch}>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for a Character..." />
        <button disabled={loading}>{loading ? 'Searching…' : 'Search'}</button>
      </form>

      <ul className={styles.results}>
        {results.map((item, i) => (
          <li key={i}>
            <Button variant="character-result">{item}</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
