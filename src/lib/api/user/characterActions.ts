import { createClient } from '@/lib/supabase/supabaseSSR';
import { Character } from '@/types/Character';

export default async function fetchCharacter(themeId: string): Promise<Character | undefined> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { characterName: 'No Character', image_url: '/no-image-placeholder.jpg' };

  // fetch chosen character for the theme
  const { data: characterData, error } = await supabase.from('user_characters').select('*').eq('user_id', user.id).eq('theme_id', themeId).maybeSingle();

  if (error) {
    console.error('Error fetching character:', error);
    return { characterName: 'No Character', image_url: '/no-image-placeholder.jpg' };
  } else if (!characterData || characterData.length === 0) {
    console.log('No character found for the user in this theme');
    return { characterName: 'No Character', image_url: '/no-image-placeholder.jpg' };
  }

  return { characterName: characterData.name, image_url: characterData.image_url };
}
