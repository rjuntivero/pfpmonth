'use client';

import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import styles from './ThemeSearch.module.css';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
export default function ThemeSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

    const prompt = `You are helping someone choose a pop culture theme for a profile picture event. Given a keyword like "teen", "vampire", or "magic", 
    return a list of 1-15 popular pop culture franchises, TV shows, movies, or books that are well-known and have a broad cast of recognizable characters.
    Only respond with the names of the franchises.
    Do not generate original or creative names.
    Do not explain anything.
    Just return the list of titles. Heres the given keyword "${query}"`;

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

  return (
    <div className={styles.container}>
      <form onSubmit={handleSearch}>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search themes…" />
        <button disabled={loading}>{loading ? 'Searching…' : 'Search'}</button>
      </form>

      <ul className={styles.results}>
        {results.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
