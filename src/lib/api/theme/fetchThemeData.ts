import { createClient } from '@/lib/supabase/supabaseSSR';
import { error } from 'console';

export async function fetchThemeData({ themeMonth }: { themeMonth: string }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error };
  }

  const { data: themeData } = await supabase
    .from('themes')
    .select(
      `
      id, 
      name, 
      description, 
      image_url,
      status, 
      created_by ( 
        username, 
        avatar_url
      ), 
      user_characters ( 
        id,
        name,
        theme_id,
        image_url,
        user_id, 
        users (
          username,
          avatar_url
        )
      ), 
      themes_likes( 
        liked, 
        user_id
      )
    `
    )
    .eq('theme_month', themeMonth)
    .single();

  if (!themeData) return { error };

  const likes = themeData.theme_likes?.filter((l: any) => l.liked).length ?? 0;
  const dislikes = themeData.theme_likes?.filter((l: any) => !l.liked).length ?? 0;
  const participants =
    themeData.user_characters?.map((c: any) => ({
      id: c.id,
      user_id: c.user_id,
      theme_id: c.theme_id,
      image_url: c.image_url,
      avatar_url: c.users.avatar_url,
      username: c.users.username,
      character_name: c.name,
      character_image: c.image_url,
    })) ?? [];
  return {
    theme: {
      id: themeData?.id,
      name: themeData?.name,
      description: themeData?.description,
      image_url: themeData?.image_url,
      theme_month: themeMonth,
      status: themeData?.status,
      created_by: {
        username: themeData?.created_by?.username,
        avatar_url: themeData?.created_by?.avatar_url,
      },
      likes,
      dislikes,
      participants,
    },
  };
}
