import { createClient } from '@/lib/supabase/supabase';
import { PollOption } from './fetchPollOptions';

export async function fetchServerPoll(serverId: string): Promise<PollOption> {
  const supabase = createClient();

  const { data: poll, error } = await supabase.from('polls').select('*').eq('server_id', serverId).maybeSingle();

  if (error) {
    console.error('❌ Failed to fetch polls:', error.message);
  }

  return poll;
}
