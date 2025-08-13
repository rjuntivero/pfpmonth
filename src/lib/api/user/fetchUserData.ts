import { createClient } from '@/lib/supabase/supabaseSSR';

export default async function fetchUserData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { serverName: null, serverId: null, themes: [] };

  const avatar_url = user.user_metadata.avatar_url;

  console.log('User ID:', user.id);
  const { data: userData } = await supabase.from('user_servers').select('users(username), joined_at').eq('user_id', user.id).single();
  const joinedAt = new Date(userData?.joined_at);
  const formattedDate = joinedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  console.log('Fetched user data:', userData);
  return { username: userData?.users.username, joined_at: formattedDate, avatar_url: avatar_url, user_id: user.id };
}
