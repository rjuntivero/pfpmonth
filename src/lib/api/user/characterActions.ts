import { createClient } from '@/lib/supabase/supabaseSSR';
import { Character } from '@/types/Character';

export async function fetchCharacter(themeId: string): Promise<Character | undefined> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { name: 'No Character', image_url: '/no-image-placeholder.jpg', id: '', theme_id: '', user_id: '' };

  // fetch chosen character for the theme
  const { data: characterData, error } = await supabase.from('user_characters').select('*').eq('user_id', user.id).eq('theme_id', themeId).maybeSingle();

  if (error) {
    console.error('Error fetching character:', error);
    return { name: 'No Character', image_url: '/no-image-placeholder.jpg', id: '', theme_id: '', user_id: '' };
  } else if (!characterData || characterData.length === 0) {
    console.log('No character found for the user in this theme');
    return { name: 'No Character', image_url: '/no-image-placeholder.jpg', id: '', theme_id: '', user_id: '' };
  }

  return { name: characterData.name, image_url: characterData.image_url, id: characterData.id, theme_id: characterData.theme_id, user_id: characterData.user_id };
}

export async function fetchCharacters(): Promise<Character[] | undefined> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  // fetch user's chosen character for the theme
  const { data: characterData, error } = await supabase.from('user_characters').select('*').eq('user_id', user.id);

  if (error) {
    console.error('Error fetching character:', error);
    return [];
  } else if (!characterData || characterData.length === 0) {
    console.log('No character found for the user in this theme');
    return [];
  }

  console.log('Fetched character data:', characterData);

  return characterData;
}
