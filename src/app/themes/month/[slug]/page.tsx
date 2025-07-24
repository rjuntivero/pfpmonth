import { parseSlug } from '@/lib/utils/utils';
import ThemePage from '@/components/views/ThemeViews/ThemePage/ThemePage';
import SuggestionPage from '@/components/views/ThemeViews/SuggestionPage/SuggestionPage';
import EmptyPage from '@/components/views/ThemeViews/EmptyPage/EmptyPage';
import LockedPage from '@/components/views/ThemeViews/LockedPage/LockedPage';
import { createClient } from '@/lib/supabase/supabaseSSR';
import { Theme } from '@/types/Theme';
import { fetchServer } from '@/lib/api/server/fetchServer';

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const supabase = await createClient();
  const parsed = parseSlug(slug);
  const discordServer = fetchServer();
  // parsed date from URL
  const [dateString, dateObj] = parsed ?? ['', null];

  const now = new Date();
  const nowUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const themeMonth = dateString;

  // Try to fetch a final theme
  const { data: theme } = await supabase.from('themes').select('*').eq('theme_month', themeMonth).maybeSingle<Theme>();
  // Check if date is in past or future
  const isPast = dateObj instanceof Date && (dateObj.getFullYear() < nowUTC.getFullYear() || (dateObj.getFullYear() === nowUTC.getFullYear() && dateObj.getMonth() < nowUTC.getMonth()));

  const isFuture = dateObj instanceof Date && (dateObj.getFullYear() > nowUTC.getFullYear() || (dateObj.getFullYear() === nowUTC.getFullYear() && dateObj.getMonth() > nowUTC.getMonth()));

  if (theme) {
    return <ThemePage inPast={isPast} theme={theme} />;
  }

  if (!theme && isPast) {
    return <LockedPage slug={slug} />;
  }

  // Check poll suggestions if future
  if (isFuture) {
    const { data: centralPoll, error: pollError } = await supabase
      .from('polls')
      .select('id, poll_options(*)')
      .eq('server_id', (await discordServer).data?.server_id)
      .maybeSingle();

    if (pollError) {
      console.error('Error fetching central poll:', pollError);
    }

    const suggestions = centralPoll?.poll_options?.sort((a, b) => a.index - b.index) ?? [];

    const usedSuggestions = new Set();

    const suggestion = suggestions.find((s) => !usedSuggestions.has(s.id));

    if (suggestion) {
      usedSuggestions.add(suggestion.id);

      const suggestionData = {
        id: suggestion.id,
        name: suggestion.name || 'No Theme',
        image_url: suggestion.image_url ?? '/no-image-placeholder.jpg',
        theme_month: themeMonth,
      };

      return <SuggestionPage suggestion={suggestionData} />;
    }
  }

  return <EmptyPage slug={slug} />;
}
