import { createClient } from '@/lib/supabase/supabaseSSR';

export async function createServerPoll(serverId: string): Promise<void> {
  const supabase = await createClient();

  const { data: existingPolls = [] } = await supabase.from('polls').select('*').eq('server_id', serverId).maybeSingle();

  if (!existingPolls) {
    await supabase.from('polls').insert({ server_id: serverId });
  }
}

export async function updatePollOptionVote(pollOptionId: string, userId: string) {
  const supabase = await createClient();

  const { data: existingVote } = await supabase.from('poll_votes').select('*').eq('poll_option_id', pollOptionId).eq('user_id', userId).single();
  // Fetch current vote count
  const { data: pollOption } = await supabase.from('poll_options').select('vote_count').eq('id', pollOptionId).single();

  const currentVoteCount = pollOption?.vote_count ?? 0;

  if (existingVote) {
    // user has already voted, remove their vote
    const { data: notVoted } = await supabase.from('poll_votes').delete().eq('id', existingVote.id);
    // decrement vote count
    const { data: error } = await supabase
      .from('poll_options')
      .update({ vote_count: currentVoteCount - 1 })
      .eq('id', pollOptionId);

    return { notVoted };
  } else {
    // add user vote
    const { data: voted } = await supabase.from('poll_votes').insert({ poll_option_id: pollOptionId, user_id: userId });
    // increment vote count
    await supabase
      .from('poll_options')
      .update({ vote_count: currentVoteCount + 1 })
      .eq('id', pollOptionId);
    return { voted };
  }
}

export async function uploadPollImage({ fileName, fileBuffer, serverId }: { fileName: string; fileBuffer: Buffer; serverId: string }) {
  const supabase = await createClient();

  const filePath = `poll-themes/${serverId}/${fileName}`;

  const { error } = await supabase.storage.from('theme-images').upload(filePath, fileBuffer, {
    upsert: true,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage.from('theme-images').getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
