import { createClient } from '@/lib/supabase/supabaseSSR';

export type Server = {
  server_id: string;
  name: string;
  icon_url: string | null;
};

type SupabaseServerRow = {
  server_id: string;
  servers: {
    name: string;
    icon_url: string | null;
  }[];
};

export async function fetchServer(): Promise<Server | undefined> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return undefined;
  }
  const { data, error } = await supabase.from('user_servers').select('server_id, servers( name )').eq('user_id', user.id).maybeSingle<SupabaseServerRow>();

  if (error) throw new Error(error.message);

  if (!data) return undefined;
  const server = Array.isArray(data.servers) ? data.servers[0] : data.servers;

  return {
    server_id: data.server_id,
    name: server?.name ?? 'Unknown Server',
    icon_url: server?.icon_url ?? null,
  };
}

export async function fetchServers(): Promise<Server[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.from('user_servers').select('server_id, servers(name, icon_url)').eq('user_id', user?.id);

  if (error) throw new Error(error.message);

  const flattened: Server[] = (data || []).map((d: SupabaseServerRow) => {
    const server = Array.isArray(d.servers) ? d.servers[0] : d.servers;
    return {
      server_id: d.server_id,
      name: server?.name ?? 'Unknown Server',
      icon_url: server?.icon_url ?? null,
    };
  });

  return flattened;
}
