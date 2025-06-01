import { createClient } from '@/lib/utils/supabaseSSR';

export async function fetchServer() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const server = await supabase.from('user_servers').select('server_id, servers (name)').eq('user_id', user?.id).maybeSingle();

  return { data: server.data };
}
