import { createClient } from '@/lib/supabase/supabaseSSR';

type UserServerResponse = {
  users: {
    username: string;
  };
  joined_at: string;
};

export default async function fetchUserData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { username: null, joined_at: null, avatar_url: null, user_id: null };

  const avatar_url = user.user_metadata.avatar_url;

  const { data: userData } = await supabase.from('user_servers').select('users(username), joined_at').eq('user_id', user.id).single<UserServerResponse>();

  const joinedAt = userData?.joined_at ? new Date(userData.joined_at) : null;
  const formattedDate = joinedAt ? joinedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : null;

  return {
    username: userData?.users?.username ?? null,
    joined_at: formattedDate,
    avatar_url,
    user_id: user.id,
  };
}
