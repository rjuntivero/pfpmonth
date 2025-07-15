import { parseSlug } from '@/lib/utils/utils';
import ThemePage from '@/components/views/ThemeViews/ThemePage/ThemePage';
import SuggestionPage from '@/components/views/ThemeViews/SuggestionPage/SuggeestionPage';
import EmptyPage from '@/components/views/ThemeViews/EmptyPage/EmptyPage';
import LockedPage from '@/components/views/ThemeViews/LockedPage/LockedPage';
import { createClient } from '@/lib/utils/supabaseSSR';
import { Theme } from '@/types/Theme';

export default async function Page({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const parsed = parseSlug(params.slug);
  const [dateString, dateObj] = parsed ?? ['', null];

  const now = new Date();
  const nowUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  // Fetch theme
  const { data: theme } = await supabase.from('themes').select('*').eq('theme_month', dateString).maybeSingle<Theme>();

  if (theme) return <ThemePage theme={theme} />;

  // past months get a locked view (no suggestion/upload)
  const isPast = dateObj instanceof Date && (dateObj.getFullYear() < nowUTC.getFullYear() || (dateObj.getFullYear() === nowUTC.getFullYear() && dateObj.getMonth() < nowUTC.getMonth()));

  if (isPast) return <LockedPage slug={params.slug} />;

  // no theme, not past — check for suggestion
  const { data: centralPoll } = await supabase.from('polls').select('id, poll_options(*)').maybeSingle();

  const suggestions = centralPoll?.poll_options?.sort((a, b) => a.index - b.index) ?? [];
  const usedSuggestions = new Set(); // You could persist this in memory if needed

  const isFuture = dateObj instanceof Date && (dateObj.getFullYear() > nowUTC.getFullYear() || (dateObj.getFullYear() === nowUTC.getFullYear() && dateObj.getMonth() > nowUTC.getMonth()));

  // Future month and no theme — try using a suggestion
  if (isFuture && suggestions.length > 0) {
    const suggestion = suggestions.find((s) => !usedSuggestions.has(s.id));
    if (suggestion) {
      usedSuggestions.add(suggestion.id);

      const suggestionData = {
        id: suggestion.id,
        name: suggestion.name || 'No Theme',
        image_url: suggestion.image_url ?? '/no-image-placeholder.jpg',
        theme_month: dateString,
      };

      return <SuggestionPage suggestion={suggestionData} slug={{ themeMonth: params.slug }} />;
    }
  }

  // No suggestion = Empty page
  return <EmptyPage slug={params.slug} />;
}
