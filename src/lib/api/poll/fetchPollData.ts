import { createClient } from '@/lib/supabase/supabaseSSR';

export async function fetchPolLData(sugggestionId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data: suggestion, error: suggestionError } = await supabase.from('poll_options_with_vote_count').select('*').eq('id', sugggestionId).maybeSingle();

  if (suggestionError) {
    console.error('❌ Failed to fetch suggestion:', suggestionError.message);
  }

  return suggestion;
}
