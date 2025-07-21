'use client';

import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import styles from './CharacterSearch.module.css';
import Button from '@/components/shared/Button/Button';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
export default function CharacterSearch({ themeTitle }: { themeTitle?: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const characterList = [] as string[];

  //generate list of characters
  const generateCharacters = async (e) => {
    e.preventDefault();
    setLoading(true);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

    const prompt = `You are helping someone choose a pop culture character for a profile picture event. Given a pop culture franchise like "Adventure Time" or a generic theme like "Vampire", 
    return a list of all possible characters within the given franchise (upwards to about 100). If given a generic theme, only return around 20 characters. 
    Only respond with the names of the character.
    Do not generate original or creative names.
    Do not explain anything.
    Start with the most popular or well-known characters first, and then list the rest in no particular order.
    I want a VERY LARGE list of characters, only limit the amount to around 100 or if the franchise/theme no longer has any characters to list.
    Just return the list of character names. Heres the given franchise or theme "${themeTitle}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const parsed = text
      .split(/[\n,-]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    setResults(parsed);
    setLoading(false);
  };

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

  generateCharacters(themeTitle);

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
