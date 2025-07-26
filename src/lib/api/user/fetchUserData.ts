import { createClient } from '@/lib/supabase/supabaseSSR';

export default async function fetchUserData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { serverName: null, serverId: null, themes: [] };

  const avatar_url = user.user_metadata.avatar_url;

  const { data: userData } = await supabase.from('users').select('username, joined_at').eq('id', user.id).single();
  const joinedAt = new Date(userData?.joined_at);
  const formattedDate = joinedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return { username: userData?.username, joined_at: formattedDate, avatar_url: avatar_url, user_id: user.id };
}
