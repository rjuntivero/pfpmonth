import { createClient } from '@/lib/supabase/supabaseSSR';
import { ThemeData } from './fetchThemeData';

interface ThemeDataProps {
  themeMonth?: string;
  characterId?: string;
}

export async function fetchThemeDataCharacterID({
  themeMonth,
  characterId,
}: ThemeDataProps): Promise<ThemeData | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  console.log('Character ID: ', characterId);
  const { data: themeId } = await supabase
    .from('user_characters')
    .select('theme_id')
    .eq('id', characterId)
    .single();

  if (!themeId) {
    console.error('Character not found');
    return { error: 'Character not found' };
  }

  const { data: themeData, error: themeError } = await supabase
    .from('themes')
    .select(
      `
      id, 
      name, 
      description, 
      image_url,
      status, 
      theme_month
    `
    )
    .eq('id', themeId.theme_id)
    .single<ThemeData>();

  if (themeError || !themeData) {
    console.error('Error fetching theme:', themeError);
    return { error: 'Theme not found' };
  }

  const participants =
    themeData?.user_characters?.map((c) => ({
      id: c.id,
      user_id: c.user_id,
      theme_id: c.theme_id,
      image_url: c.image_url,
      character_name: c.character_name,
      character_image: c.image_url,
    })) ?? [];
  return {
    id: themeData?.id,
    name: themeData?.name,
    description: themeData?.description,
    image_url: themeData?.image_url,
    theme_month: themeMonth || themeData?.theme_month,
    status: themeData?.status,
    created_by: {
      username: themeData?.created_by?.username,
      avatar_url: themeData?.created_by?.avatar_url,
    },
    participants,
  };
}
