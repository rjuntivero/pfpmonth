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
      name,
      image_url,
      vote_count,
      poll_votes (
        user_id,
        users (
          username,
          avatar_url
        )
      )
    `
    )
    .eq('poll_id', pollId);

  console.log('THESE POLLS WERE SELECTED ', pollOptionsData);

  if (error || !pollOptionsData) {
    return { error };
  }

  const pollThemes = pollOptionsData.map((option) => ({
    id: option.id,
    name: option.name,
    image_url: option.image_url,
    vote_count: option.vote_count,
    supporters: option.poll_votes.map((vote) => ({
      user_id: vote.user_id,
      username: vote.users.username,
      avatar_url: vote.users.avatar_url,
    })),
  }));

  console.log('FETCHED POLL THEME: ', pollThemes);

  return { pollThemes };
}
