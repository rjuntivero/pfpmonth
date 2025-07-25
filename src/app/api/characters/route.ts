import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { redis } from '@/lib/redis';

export async function GET(req: NextRequest) {
  const theme = req.nextUrl.searchParams.get('theme')?.toLowerCase();

  if (!theme) return NextResponse.json({ error: 'Theme is required' }, { status: 400 });

  console.log(`theme key : theme:${theme}`);
  const cacheKey = `theme:${theme}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    const characters = Array.isArray(cached) ? cached : [];

    const uniqueCharacters = Array.from(new Set(characters));
    return NextResponse.json({ source: 'cache', characters: uniqueCharacters });
  }

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

  const prompt = `You are helping someone choose a pop culture character for a profile picture event. Given a pop culture franchise like "Adventure Time" or a generic theme like "Vampire", 
    return a list of all possible characters within the given franchise (upwards to about 100). If given a generic theme, only return around 20 characters. 
    Only respond with the names of the character.
    If you can't recognize ANY characters from the given theme, return a message saying "No characters found for this theme.".
    Do not generate original or creative names.
    Do not explain anything, for example, do not explain acronyms with a parentheses.
    Don't include additional information or context for vague descriptions in parentheses such as 'The farmworld characters (Finn, Jake, etc.)' or 'Simon Petrikov (Pre-Ice King)'
    Start with the most popular or well-known characters first, and then list the rest in no particular order.
    I want a VERY LARGE list of characters, only limit the amount to around 100 or if the franchise/theme no longer has any characters to list.
    Just return the list of character names. Heres the given franchise or theme "${theme}"`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const characters = text
    .split(/[\n,-]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  await redis.set(cacheKey, JSON.stringify(characters), { ex: 60 * 60 * 24 });

  return NextResponse.json({ source: 'ai', characters });
}
