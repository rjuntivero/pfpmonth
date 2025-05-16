// utils/themeHelpers.ts
import { createClient } from '@/utils/supabaseSSR';

interface UserServer {
  server_id: string;
  servers: {
    name: string;
  };
}

export async function fetchThemesAndServer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { serverName: null, serverId: null, themes: [] };
  }

  const { data } = await supabase.from('user_servers').select('server_id, servers (name)').eq('user_id', user.id).maybeSingle();

  const userServer = data as UserServer | null;

  const serverName = userServer?.servers?.name ?? null;
  const serverId = userServer?.server_id ?? null;

  let themes = [];
  if (serverId) {
    const { data: themeData } = await supabase.from('themes').select('*').eq('server_id', serverId).order('start_date', { ascending: true });

    themes = themeData ?? [];
  }

  return { serverName, serverId, themes };
}
