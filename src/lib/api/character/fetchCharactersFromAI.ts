import fs from 'fs/promises';
import path from 'path';

async function fetchCharactersFromAI(serverId: string, theme: string) {
  return [];
}

export async function getCharactersForTheme(theme: string) {
  const cacheFilePath = path.join(process.cwd(), 'cache', `${theme}.json`);
  if (process.env.NODE_ENV === 'development') {
    try {
      const cachedData = await fs.readFile(cacheFilePath, 'utf-8');
      console.log(`Serving from DEVELOPMENT cache for: ${theme}`);
      return JSON.parse(cachedData);
    } catch (error) {
      // File doesn't exist, so fetch and save it.
    }
  }

  const characters = await fetchCharactersFromAI(theme);

  if (process.env.NODE_ENV === 'development') {
    await fs.mkdir(path.join(process.cwd(), 'cache'), { recursive: true });
    await fs.writeFile(cacheFilePath, JSON.stringify(characters, null, 2));
  }
  return characters;
}
