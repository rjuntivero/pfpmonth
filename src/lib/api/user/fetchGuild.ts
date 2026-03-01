import { createClient } from '@/lib/supabase/supabaseSSR';

export default async function fetchGuild(serverId: string) {
  const supabase = await createClient();

  // fetch guild members
  const { data: guildMembers, error: guildError } = await supabase
    .from('user_servers')
    .select('discord_users(username,avatar_url,discord_id), user_id')
    .eq('server_id', serverId);

  if (guildError) {
    throw new Error('Failed to fetch guild members: ', guildError);
  }

  return guildMembers;
}
