import { createClient } from '@/lib/supabase/supabaseSSR';

type Server = {
  server_id: string;
  servers: {
    name: string;
    icon_url: string | null;
  };
};

type FetchServerResponse = {
  data: Server | null;
};

export async function fetchServer(): Promise<FetchServerResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.from('user_servers').select('server_id, servers( name )').eq('user_id', user?.id).maybeSingle<Server>();

  if (error) {
    console.error('Error fetching server:', error.message);
    return { data: null };
  }

  return { data };
}

export async function fetchServers() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.from('user_servers').select('server_id, servers(name, icon_url)').eq('user_id', user?.id);

  if (error) {
    console.error('Error fetching servers:', error.message);
    return { serverNames: [] };
  }

  return { serverNames: data ?? [] };
}
