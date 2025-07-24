import { createClient } from '@/lib/supabase/supabaseSSR';
import { error } from 'console';

interface Props {
  suggestionId: string;
}
export async function fetchPollData({ suggestionId }: Props) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error };
  }

  const { data: pollData } = await supabase
    .from('poll_options')
    .select(
      `
      id, 
      poll_id (
        id
      ),
      option_text,
      image_url,
      created_by (
        id,
        username,
        avatar_url
        ),
      server_id (
        id
        ),
      name
    `
    )
    .eq('id', suggestionId)
    .single();

  console.log('Fetched poll data:', pollData);

  if (!pollData) {
  }

  return {};
}
