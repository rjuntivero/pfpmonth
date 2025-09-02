import { createClient } from '@/lib/supabase/supabaseSSR';
import { MonthSlotType } from '@/components/layout/ThemeOverviewPanel/SuggestionsCalendar/SuggestionsCalendar';
import { PollOption } from '@/lib/api/poll/fetchPollOptions';
import { MONTHS } from '@/lib/utils/stringUtils';

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

export async function promoteAssignedSuggestionsToThemes(months: MonthSlotType[], year: number, serverId: string) {
  const supabase = await createClient();

  for (const month of months) {
    // skip preassigned months or months without assignedSuggestion
    if (month.isPreassigned || !month.assignedSuggestion) continue;

    const suggestion: PollOption = month.assignedSuggestion;

    // prepare theme data
    const themeData = {
      name: suggestion.name,
      description: suggestion.description,
      theme_month: `${year}-${String(MONTHS.indexOf(month.month) + 1).padStart(2, '0')}-01`,
      image_url: suggestion.image_url ?? null,
      server_id: serverId,
      created_by: suggestion.created_by.id,
    };

    // insert the theme
    const { data, error } = await supabase.from('themes').upsert(themeData, { onConflict: 'theme_month,server_id' });

    if (error) {
      console.error(`Failed to update theme for ${month.month}:`, error);
      continue;
    }
    // delete all votes for this poll option
    const { error: voteDeleteError } = await supabase.from('poll_votes').delete().eq('poll_option_id', suggestion.id);

    if (voteDeleteError) {
      console.error(`Failed to delete votes for poll option ${suggestion.id}:`, voteDeleteError);
    }

    // delete the poll option itself
    const { error: pollDeleteError } = await supabase.from('poll_options').delete().eq('id', suggestion.id);

    if (pollDeleteError) {
      console.error(`Failed to delete poll option ${suggestion.id}:`, pollDeleteError);
    }
  }
}
