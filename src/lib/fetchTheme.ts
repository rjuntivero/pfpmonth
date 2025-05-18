import { createClient } from '@/utils/supabaseSSR';
import { error } from 'console';

export async function fetchThemeData({ themeId }: { themeId: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error };
  }

  const { data: themeData } = await supabase.from('themes').select('image_url, name').eq('id', themeId).single();

  const themeImage = themeData?.image_url;
  const themeName = themeData?.name;
  console.log('FETCHED THEME IMAGE: ', themeImage);

  return { themeImage: themeImage, themeName: themeName };
}
