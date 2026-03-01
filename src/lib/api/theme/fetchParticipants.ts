import { createClient } from '@/lib/supabase/supabase';
import { Participant } from '@/types/Participant';

export async function fetchParticipants(themeId: string): Promise<Participant[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_characters')
    .select(
      `
      *,
      users (
        username,
        avatar_url
      )
    `
    )
    .eq('theme_id', themeId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching participants:', error.message);
    return [];
  }

  return data ?? [];
}
