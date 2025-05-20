import { createClient } from '@/utils/supabaseSSR';
import { error } from 'console';

export async function fetchThemeData({ themeId }: { themeId: string }) {
  const supabase = await createClient();
  console.log('THEME ID TO FETCH: ', themeId);

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
      start_date,
      image_url,
      status, 
      created_by ( 
        username, 
        avatar_url
      ), 
      user_characters ( 
        user_id, 
        name,
        image_url,
        user:users (
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
    .eq('id', themeId)
    .single();
  console.log('THEME FETCHED: ', themeData);

  if (!themeData) return { error };

  const likes = themeData.theme_likes?.filter((l: any) => l.liked).length ?? 0;
  const dislikes = themeData.theme_likes?.filter((l: any) => !l.liked).length ?? 0;
  const participants =
    themeData.user_characters?.map((c: any) => ({
      username: c.user.username,
      avatar_url: c.user.avatar_url,
      character_name: c.name,
      character_image: c.image_url,
    })) ?? [];
  return {
    theme: {
      id: themeData?.id,
      name: themeData?.name,
      description: themeData?.description,
      image_url: themeData?.image_url,
      start_date: themeData?.start_date,
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
