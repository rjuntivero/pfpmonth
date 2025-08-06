import { createClient } from '@/lib/supabase/supabaseSSR';

export async function fetchServerMembers(serverId: string) {
  const supabase = await createClient();

  const guildMembers = await supabase.from('user_servers').select('*').eq('server_id', serverId).maybeSingle();

  return { data: guildMembers.data };
}
