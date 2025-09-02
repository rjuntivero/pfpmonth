import { createClient } from '@/lib/supabase/supabase';

export interface ServerPoll {
  id: string;
  server_id: string;
  created_at: string;
}

export async function fetchServerPoll(serverId: string): Promise<ServerPoll> {
  const supabase = createClient();

  const { data: poll, error } = await supabase.from('polls').select('*').eq('server_id', serverId).maybeSingle();

  if (error) {
    console.error('❌ Failed to fetch polls:', error.message);
  }

  console.log('Fetched Server poll:', poll);
  return poll;
}
