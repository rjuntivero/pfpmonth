import { createClient } from '@/utils/supabaseSSR';

export async function createPolls(serverId: string): Promise<void> {
  const supabase = await createClient();
  console.log(serverId);

  const { data: existingPolls = [] } = await supabase.from('polls').select('*').eq('server_id', serverId).maybeSingle();

  if (!existingPolls) {
    await supabase.from('polls').insert({ server_id: serverId });
  }
}
