import { createClient } from '@/lib/supabase/supabaseSSR';
import { createPolls } from '../poll/createPolls';
import { Slide } from '@/types/Slide';
import { Theme, ThemeSliderResult } from '@/types/Theme';
import { toSlug } from '@/lib/utils/utils';
import { fetchServerPoll } from '../poll/fetchServerPoll';
import { fetchPollThemes } from '../poll/fetchPollThemes';
import { fetchServer } from '../server/fetchServer';
import { MONTHS } from '@/lib/utils/utils';

export async function fetchThemes(selectedYear: number, serverIdFromCookie?: string): Promise<ThemeSliderResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { serverName: null, serverId: null, themes: [] };

  // create server poll if it does not yet exist
  if (serverIdFromCookie) {
    await createPolls(serverIdFromCookie as string);
  }

  // fetch existing poll themes
  const pollExists = await fetchServerPoll(serverIdFromCookie as string);
  if (pollExists) {
    const pollOptionsExist = await fetchPollThemes({ pollId: pollExists.poll_id as string });
    if (pollOptionsExist) {
      pollOptionsExist.pollThemes?.map((poll) => poll);
    }
  }

  let serverName: string | null = null;
  let resolvedServerId = serverIdFromCookie ?? null;

  // fetch serverId from cookie or user server
  if (!resolvedServerId) {
    const { data: userServer } = await fetchServer();

    resolvedServerId = userServer?.server_id ?? null;
    serverName = userServer?.servers?.name ?? null;
  } else {
    const { data: server } = await supabase.from('servers').select('name').eq('id', resolvedServerId).single();

    serverName = server?.name ?? null;
  }

  if (!resolvedServerId) return { serverName, serverId: null, themes: [] };

  const now = new Date();
  const currentYear = selectedYear;

  // fetch official themes
  const { data: themesData = [] } = await supabase.from('themes').select('id, name, image_url, theme_month, description').eq('server_id', resolvedServerId);
  const themes = themesData as Theme[];

  // fetch centralized poll
  const { data: centralPoll } = await supabase.from('polls').select(`id, poll_options ( id, vote_count, image_url, name, poll_id, created_at )`).eq('server_id', resolvedServerId).maybeSingle();

  const suggestions = (centralPoll?.poll_options ?? []).sort((a, b) => {
    const voteDiff = (b.vote_count ?? 0) - (a.vote_count ?? 0);
    return voteDiff !== 0 ? voteDiff : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // avoid reusing suggestions
  const usedSuggestions = new Set<string>();

  const slides: Slide[] = MONTHS.map((monthName, monthIndex) => {
    const month = String(monthIndex + 1).padStart(2, '0');
    const slug = toSlug(monthIndex, currentYear);
    const isCurrentMonth = now.getFullYear() === currentYear && now.getMonth() === monthIndex;

    const theme = themes.find((t) => t.theme_month?.startsWith(`${currentYear}-${month}`));
    const themeMonth = `${currentYear}-${month}-01`;

    // slides that have a corresponding theme table entry
    if (theme) {
      return {
        month: monthName,
        year: currentYear,
        image: theme.image_url,
        name: theme.name,
        id: theme.id,
        description: theme.description,
        tag: [],
        route: `/themes/month/${slug}`,
        type: 'final',
        theme_month: themeMonth,
      };
    }

    // current active month slide without a theme
    if (isCurrentMonth) {
      return {
        month: monthName,
        year: currentYear,
        image: '/no-image-placeholder.jpg',
        name: 'No Theme',
        tag: 'active',
        route: `/themes/month/${slug}`,
        type: 'tbd',
        theme_month: themeMonth,
      };
    }

    const isFuture = currentYear > now.getFullYear() || (currentYear === now.getFullYear() && monthIndex > now.getMonth());

    // If future month and theme is missing, use suggestion if available
    if (isFuture && suggestions.length > 0) {
      const suggestion = suggestions.find((s) => !usedSuggestions.has(s.id));
      if (suggestion) {
        usedSuggestions.add(suggestion.id);
        return {
          month: monthName,
          year: currentYear,
          image: suggestion.image_url ?? '/no-image-placeholder.jpg',
          name: suggestion.name || 'No Theme',
          id: suggestion.id,
          tag: 'suggested',
          route: `/themes/month/${slug}`,
          type: 'suggestion',
          theme_month: themeMonth,
        };
      }
    }

    // future slide WITHOUT a theme
    return {
      month: monthName,
      year: currentYear,
      image: '/no-image-placeholder.jpg',
      name: 'No Theme',
      tag: 'inactive',
      route: `/themes/month/${slug}`,
      type: 'tbd',
      theme_month: themeMonth,
    };
  });

  // log final slides
  console.log('📊 Final slides generated for theme slider:', slides);

  return { serverName, serverId: resolvedServerId, themes: slides };
}
