import { createClient } from '@/utils/supabaseSSR';

export async function fetchPollThemes({ pollId }: { pollId: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }
  console.log('POLL ID', pollId);

  const { data: pollOptionsData, error } = await supabase
    .from('poll_options')
    .select(
      `
      id,
      poll_id,
      option_text,
      vote_count,
      image_url,
      server_id,
      name,
      polls (
        theme_month
      ),
      poll_votes (
        user_id,
        users (
          username,
          avatar_url
        )
      ),
      created_by:users (
        username,
        avatar_url
      )
    `
    )
    .eq('poll_id', pollId);

  console.log('THESE POLLS WERE SELECTED ', pollOptionsData);

  if (error || !pollOptionsData) {
    return { error };
  }

  const pollThemes = pollOptionsData.map((option) => {
    const themeMonth = option.polls?.[0]?.theme_month ?? '';
    const [year, month] = themeMonth.split('-');

    return {
      id: option.id,
      name: option.name,
      image_url: option.image_url,
      vote_count: option.vote_count,
      created_by: {
        username: option.created_by?.username ?? '',
        avatar_url: option.created_by?.avatar_url ?? '',
      },
      description: option.option_text,
      server_id: option.server_id,
      poll_id: option.poll_id,
      month: month,
      year: year,
      supporters:
        option.poll_votes?.map((vote) => ({
          user_id: vote.user_id,
          username: vote.users?.username ?? '',
          avatar_url: vote.users?.avatar_url ?? '',
        })) ?? [],
    };
  });

  console.log('FETCHED POLL THEME: ', pollThemes);

  return { pollThemes };
}
