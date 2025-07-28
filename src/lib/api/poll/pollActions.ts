import { createClient } from '@/lib/supabase/supabaseSSR';

export async function createServerPoll(serverId: string): Promise<void> {
  const supabase = await createClient();

  const { data: existingPolls = [] } = await supabase.from('polls').select('*').eq('server_id', serverId).maybeSingle();

  if (!existingPolls) {
    await supabase.from('polls').insert({ server_id: serverId });
  }
}

export async function getPollOptionVoteCount(pollOptionId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase.from('poll_votes').select('*', { count: 'exact', head: true }).eq('poll_option_id', pollOptionId);

  if (error) {
    console.error('Error fetching vote count:', error);
    return 0;
  }

  return count ?? 0;
}

export async function updatePollOptionVote(pollOptionId: string, userId: string) {
  const supabase = await createClient();

  // check if vote already exists
  const { data: existingVote } = await supabase.from('poll_votes').select('*').eq('poll_option_id', pollOptionId).eq('user_id', userId).single();

  if (existingVote) {
    // remove vote
    await supabase.from('poll_votes').delete().eq('id', existingVote.id);
    return { notVoted: true };
  } else {
    // add vote
    await supabase.from('poll_votes').insert({ poll_option_id: pollOptionId, user_id: userId });
    return { voted: true };
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
