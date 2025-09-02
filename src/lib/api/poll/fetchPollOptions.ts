import { createClient } from '@/lib/supabase/supabaseSSR';

type SupabaseVoteRow = {
  user_id: string;
  users?: {
    username: string;
    avatar_url: string;
  } | null;
};

type SupabaseOptionRow = {
  id: string;
  poll_id: string;
  option_text: string;
  vote_count: number | null;
  image_url: string | null;
  server_id: string;
  name: string;
  poll_votes?: SupabaseVoteRow[] | null;
  created_by?: {
    id: string;
    username: string;
    avatar_url: string;
  } | null;
  created_at: string;
};

export type PollOption = {
  id: string;
  name: string;
  image_url: string | null;
  vote_count: number | null;
  description: string;
  server_id: string;
  poll_id: string;
  created_by: {
    id: string;
    username: string;
    avatar_url: string;
  };
  supporters: {
    user_id: string;
    username: string;
    avatar_url: string;
  }[];
  hasVoted: boolean;
  created_at: string;
};

export async function fetchPollOptions(serverPollId: string): Promise<{ pollOptions?: PollOption[]; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('poll_options_with_vote_count')
    .select(
      `
      id,
      poll_id,
      option_text,
      vote_count,
      image_url,
      server_id,
      name,
      created_at,
      poll_votes (
        user_id,
        users (
          username,
          avatar_url
        )
      ),
      created_by:users (
        id,
        username,
        avatar_url
      )
    `
    )
    .eq('poll_id', serverPollId);

  if (error || !data) return { error: error?.message };

  // Cast Supabase raw data to our flat DTO
  const pollOptionsData = data as unknown as SupabaseOptionRow[];

  const pollOptions: PollOption[] = pollOptionsData.map((option) => ({
    id: option.id,
    name: option.name,
    image_url: option.image_url,
    vote_count: option.vote_count,
    created_by: {
      id: option.created_by?.id ?? '',
      username: option.created_by?.username ?? '',
      avatar_url: option.created_by?.avatar_url ?? '',
    },
    description: option.option_text,
    server_id: option.server_id,
    poll_id: option.poll_id,
    supporters:
      option.poll_votes?.map((vote) => ({
        user_id: vote.user_id,
        username: vote.users?.username ?? '',
        avatar_url: vote.users?.avatar_url ?? '',
      })) ?? [],
    hasVoted: option.poll_votes?.some((vote) => vote.user_id === user.id) ?? false,
    created_at: option.created_at,
  }));

  return { pollOptions };
}
