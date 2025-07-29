import { createClient } from '@/lib/supabase/supabaseSSR';
import { createServerPoll } from '../poll/pollActions';
import { Slide } from '@/types/Slide';
import { Theme, ThemeSliderResult } from '@/types/Theme';
import { toSlug } from '@/lib/utils/stringUtils';
import { fetchServerPoll } from '../poll/fetchServerPoll';
import { fetchPollOptions } from '../poll/fetchPollOptions';
import { fetchServer } from '../server/fetchServer';
import { MONTHS } from '@/lib/utils/stringUtils';

export async function fetchThemes(selectedYear: number, serverIdFromCookie?: string): Promise<ThemeSliderResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { serverName: null, serverId: null, themes: [] };

  // create server poll if it does not yet exist
  if (serverIdFromCookie) {
    await createServerPoll(serverIdFromCookie as string);
  }

  // fetch existing poll themes
  const pollExists = await fetchServerPoll(serverIdFromCookie as string);
  if (pollExists) {
    const pollOptionsExist = await fetchPollOptions(pollExists.poll_id as string);
    if (pollOptionsExist) {
      pollOptionsExist.pollOptions?.map((poll) => poll);
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
  const { data: centralPoll, error: pollError } = await supabase.from('polls').select('id').eq('server_id', resolvedServerId).maybeSingle();
  if (pollError || !centralPoll) {
    // return { suggestions: [] };
  }

  // fetch poll options
  const { data: pollOptions, error: optionsError } = await supabase.from('poll_options_with_vote_count').select('*').eq('poll_id', centralPoll?.id);

  if (optionsError || !pollOptions) {
    // return { suggestions: [] };
  }

  const suggestions = (pollOptions ?? []).sort((a, b) => {
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
        server_id: resolvedServerId,
        username: theme.created_by?.username,
        avatar_url: theme.created_by?.avatar_url || '/no-image-placeholder.jpg',
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
        server_id: resolvedServerId,
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
          server_id: resolvedServerId,
          description: suggestion.option_text,
          created_by_user: {
            username: suggestion.created_by_user?.username,
            avatar_url: suggestion.created_by_user?.avatar_url || '/no-image-placeholder.jpg',
          },
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
      server_id: resolvedServerId,
    };
  });

  // log final slides
  // console.log('📊 Final slides generated for theme slider:', slides);

  return { serverName, serverId: resolvedServerId, themes: slides };
}
