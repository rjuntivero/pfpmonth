import { parseSlug } from '@/lib/utils/utils';
import ThemePage from '@/components/views/ThemeViews/ThemePage/ThemePage';
import SuggestionPage from '@/components/views/ThemeViews/SuggestionPage/SuggestionPage';
import EmptyPage from '@/components/views/ThemeViews/EmptyPage/EmptyPage';
import LockedPage from '@/components/views/ThemeViews/LockedPage/LockedPage';
import { createClient } from '@/lib/supabase/supabaseSSR';
import { Theme } from '@/types/Theme';
import { fetchServer } from '@/lib/api/server/fetchServer';

export default async function Page({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const parsed = parseSlug(params.slug);
  const discordServer = fetchServer();
  const [dateString, dateObj] = parsed ?? ['', null];

  const now = new Date();
  const nowUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const themeMonth = dateString;

  // Try to fetch a final theme
  const { data: theme } = await supabase.from('themes').select('*').eq('theme_month', themeMonth).maybeSingle<Theme>();

  if (theme) {
    return <ThemePage theme={theme} />;
  }

  // Check if date is in past or future
  const isPast = dateObj instanceof Date && (dateObj.getFullYear() < nowUTC.getFullYear() || (dateObj.getFullYear() === nowUTC.getFullYear() && dateObj.getMonth() < nowUTC.getMonth()));

  const isFuture = dateObj instanceof Date && (dateObj.getFullYear() > nowUTC.getFullYear() || (dateObj.getFullYear() === nowUTC.getFullYear() && dateObj.getMonth() > nowUTC.getMonth()));

  if (isPast) {
    return <LockedPage slug={params.slug} />;
  }

  // Check poll suggestions if future
  if (isFuture) {
    console.log('Future date detected:', themeMonth);

    const { data: centralPoll, error: pollError } = await supabase
      .from('polls')
      .select('id, poll_options(*)')
      .eq('server_id', (await discordServer).data?.server_id)
      .maybeSingle();

    if (pollError) {
      console.error('Error fetching central poll:', pollError);
    }

    console.log('Central poll data:', centralPoll);

    const suggestions = centralPoll?.poll_options?.sort((a, b) => a.index - b.index) ?? [];

    console.log('Sorted suggestions:', suggestions);

    const usedSuggestions = new Set();

    const suggestion = suggestions.find((s) => !usedSuggestions.has(s.id));
    console.log('Selected suggestion for future month:', suggestion);

    if (suggestion) {
      usedSuggestions.add(suggestion.id);

      const suggestionData = {
        id: suggestion.id,
        name: suggestion.name || 'No Theme',
        image_url: suggestion.image_url ?? '/no-image-placeholder.jpg',
        theme_month: themeMonth,
      };

      console.log('Returning suggestion page with data:', suggestionData);
      return <SuggestionPage suggestion={suggestionData} slug={{ themeMonth: params.slug }} />;
    }
  }

  return <EmptyPage slug={await params.slug} />;
}
