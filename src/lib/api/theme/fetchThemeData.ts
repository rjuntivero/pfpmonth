import { createClient } from '@/lib/supabase/supabaseSSR';

export interface ThemeData {
  id: string;
  name: string;
  description: string;
  image_url: string;
  status: 'final' | 'suggestion' | 'tbd';

  created_by: {
    username: string;
    avatar_url: string;
  };

  user_characters?: {
    id: string;
    character_name: string;
    user_id: string;
    theme_id: string;
    image_url: string | null;
    users: {
      id: string;
      username: string;
      avatar_url: string;
    };
  }[];

  theme_month: string;

  participants: {
    id: string;
    character_name: string;
    theme_id: string;
    image_url: string | null;
    user_id: string;
  }[];
}

interface ThemeDataProps {
  themeMonth?: string;
}

export async function fetchThemeData({
  themeMonth,
}: ThemeDataProps): Promise<ThemeData | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  console.log('Theme Month:', themeMonth);
  const { data: themeData, error: themeError } = await supabase
    .from('themes')
    .select(
      `
      *,
      user_characters (
      *
    )
    `
    )
    .eq('theme_month', themeMonth)
    .single<ThemeData>();

  if (themeError || !themeData) {
    console.error('Error fetching theme:', themeError);
    return { error: 'Theme not found' };
  }

  console.log('Theme participants', themeData?.user_characters);

  if (!themeData) return { error: 'Theme not found' };

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


