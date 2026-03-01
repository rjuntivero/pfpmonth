import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { redis } from "@/lib/redis";
import { createClient } from "@/lib/supabase/supabaseSSR";

interface Props {
  themeId: string;
}

// fetch characters for a given theme
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Props> },
) {
  const supabase = await createClient();
  const { themeId } = await params;

  // fetch claimed characters for the theme
  const { data: claimedCharacters } = await supabase
    .from("user_characters")
    .select("name")
    .eq("theme_id", themeId);
  const claimedNames = claimedCharacters?.map((c) => c.name) ?? [];

  const theme = req.nextUrl.searchParams.get("theme")?.toLowerCase();

  if (!theme)
    return NextResponse.json({ error: "Theme is required" }, { status: 400 });

  // fetch redis cache
  const cacheKey = `theme:${theme}`;
  const cached = await redis.get(cacheKey);

  // if cached, return cached characters
  if (cached) {
    const characters = Array.isArray(cached) ? cached : [];

    const uniqueCharacters = Array.from(new Set(characters));

    const charactersWithStatus = uniqueCharacters.map((name) => ({
      character_name: name,
      claimed: claimedNames.includes(name),
    }));

    return NextResponse.json({
      source: "cache",
      characters: charactersWithStatus,
    });
  }

  // if not cached, call gemini api to generate characters

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

  const prompt = `You are helping someone choose a pop culture character for a profile picture event. Given a pop culture franchise like "Adventure Time" or a generic theme like "Vampire", 
    return a list of all possible characters within the given franchise (upwards to about 100). If given a generic theme, only return around 20 characters. 
    Only respond with the names of the character.
    If you can't recognize ANY characters from the given theme, return a message saying "No characters found for this theme.".
    Do not generate original or creative names.
    When you receieve a theme, first check if the theme is any recent pop culture franchise, movie, tv show, etc. (use databases like imdb, fandom, etc. to check for characters).
    Do not explain anything, for example, do not explain acronyms with a parentheses.
    Don't include additional information or context for vague descriptions in parentheses such as 'The farmworld characters (Finn, Jake, etc.)' or 'Simon Petrikov (Pre-Ice King)'
    Start with the most popular or well-known characters first, and then list the rest in no particular order.
    Generate a very large list of characters, only limit the amount to around 100 or if the franchise/theme no longer has any characters to list.
    Just return the list of character names. Heres the given franchise or theme "${theme}"`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // format into array [","]
  const characters = text
    .split(/[\n,-]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  // expiry 6 months
  await redis.set(cacheKey, JSON.stringify(characters), {
    ex: 60 * 60 * 24 * 180,
  });

  return NextResponse.json({ source: "ai", characters });
}
