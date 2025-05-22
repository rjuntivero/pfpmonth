import { parseSlug } from '@/utils/utils';
import ThemePage from '@/components/views/ThemeViews/ThemePage/ThemePage';
import SuggestionPage from '@/components/views/ThemeViews/SuggestionPage/SuggeestionPage';
import EmptyPage from '@/components/views/ThemeViews/EmptyPage/EmptyPage';
import LockedPage from '@/components/views/ThemeViews/LockedPage/LockedPage';
import { createClient } from '@/utils/supabaseSSR';
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
  console.log('THE CURRENT MONTH STRING IS: ', dateString);
  console.log('THE CURRENT MONTH IS: ', dateObj?.toString());
  console.log('THE CURRENT MONTH RN IS: ', nowUTC.toString());
  console.log('THE CURRENT MONTH IS IN THE PAST: ', isPast);

  if (isPast) return <LockedPage slug={params.slug} />;

  // no theme, not past — check for suggestion
  const { data: centralPoll } = await supabase.from('polls').select(`id, poll_options(*)`).is('theme_month', null).maybeSingle();

  const suggestions = centralPoll?.poll_options ?? [];
  const monthIndex = dateObj instanceof Date ? dateObj.getMonth() : -1;
  const suggestion = suggestions[monthIndex];

  if (suggestion) {
    return <SuggestionPage suggestion={suggestion} slug={params.slug} />;
  }

  // No suggestion = Empty page
  return <EmptyPage slug={params.slug} />;
}
