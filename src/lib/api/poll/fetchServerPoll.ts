import { Poll } from '@/types/Polls';
import { createClient } from '@/lib/utils/supabase';

export async function fetchServerPoll(serverId: string): Promise<Poll> {
  const supabase = createClient();

  const { data: poll, error } = await supabase.from('polls').select('*').eq('server_id', serverId).maybeSingle();

  if (error) {
    console.error('❌ Failed to fetch polls:', error.message);
  }

  return poll;
}
