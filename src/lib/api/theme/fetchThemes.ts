import { createClient } from '@/lib/supabase/supabaseSSR';
import { createServerPoll } from '../poll/pollActions';
import { Theme, ThemeSliderResult } from '@/types/Theme';
import { toSlug } from '@/lib/utils/stringUtils';
import { fetchServerPoll } from '../poll/fetchServerPoll';
import { fetchPollOptions } from '../poll/fetchPollOptions';
import { fetchServer } from '../server/fetchServer';
import { MONTHS } from '@/lib/utils/stringUtils';

export async function fetchThemes(
  selectedYear: number,
  serverIdFromCookie?: string
): Promise<ThemeSliderResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { serverName: null, serverId: null, themes: [] };

  let serverId = serverIdFromCookie ?? null;
  let serverName: string | null = null;

  // Fetch serverId from user server if not provided
  if (!serverId) {
    const userServer = await fetchServer();
    if (!userServer || 'error' in userServer) {
      console.error('Failed to fetch user server:', userServer?.error);
      return { serverName: null, serverId: null, themes: [] };
    }
    serverId = userServer.server_id;
  }

  // Fetch server name
  const { data: server, error: serverError } = await supabase
    .from('servers')
    .select('name')
    .eq('id', serverId)
    .single();
  if (serverError) {
    console.error('Failed to fetch server name:', serverError);
    return { serverName: null, serverId, themes: [] };
  }
  serverName = server?.name ?? null;

  // Create server poll if it does not exist
  try {
    await createServerPoll(serverId);
  } catch (err) {
    console.error('Failed to create server poll:', err);
  }

  // Fetch existing poll themes
  try {
    const pollExists = await fetchServerPoll(serverId);
    if (pollExists) {
      const pollOptionsExist = await fetchPollOptions(pollExists.id as string);
      pollOptionsExist?.pollOptions?.map((poll) => poll);
    }
  } catch (err) {
    console.error('Failed to fetch existing poll themes:', err);
  }

  const now = new Date();
  const currentYear = selectedYear;

  // Fetch official themes
  const { data: themesData = [], error: themesError } = await supabase
    .from('themes')
    .select('id, name, image_url, theme_month, description, created_by(id,username,avatar_url)')
    .eq('server_id', serverId);
  if (themesError) {
    console.error('Failed to fetch themes:', themesError);
    return { serverName, serverId, themes: [] };
  }
  const themes = themesData as unknown as Theme[];

  // Fetch centralized poll
  const { data: centralPoll, error: pollError } = await supabase
    .from('polls')
    .select('id')
    .eq('server_id', serverId)
    .maybeSingle();
  if (pollError) {
    console.error('Failed to fetch central poll:', pollError);
  }

  // Fetch poll options
  const { data: pollOptions, error: optionsError } = await supabase
    .from('poll_options_with_vote_count')
    .select('*')
    .eq('poll_id', centralPoll?.id);
  if (optionsError) {
    console.error('Failed to fetch poll options:', optionsError);
  }

  const suggestions = (pollOptions ?? []).sort((a, b) => {
    const voteDiff = (b.vote_count ?? 0) - (a.vote_count ?? 0);
    return voteDiff !== 0
      ? voteDiff
      : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const usedSuggestions = new Set<string>();

  const slides = MONTHS.map((monthName, monthIndex) => {
    const month = String(monthIndex + 1).padStart(2, '0');
    const slug = toSlug(monthIndex, currentYear);
    const isCurrentMonth = now.getFullYear() === currentYear && now.getMonth() === monthIndex;

    const theme = themes.find((t) => t.theme_month?.startsWith(`${currentYear}-${month}`));
    const themeMonth = `${currentYear}-${month}-01`;

    const defaultSlide = {
      month: monthName,
      year: currentYear,
      image: '/no-image-placeholder.jpg',
      name: 'No Theme',
      id: '',
      description: '',
      tag: undefined,
      route: `/themes/month/${slug}`,
      type: 'tbd',
      theme_month: themeMonth,
      server_id: serverId,
      username: '',
      avatar_url: '/no-image-placeholder.jpg',
      created_by: undefined as { id: string; username: string; avatar_url: string } | undefined,
    };

    if (theme) {
      return {
        ...defaultSlide,
        image: theme.image_url,
        name: theme.name,
        id: theme.id,
        description: theme.description,
        tag: 'final',
        type: 'final',
        username: theme.created_by?.username,
        avatar_url: theme.created_by?.avatar_url || '/no-image-placeholder.jpg',
      };
    }

    if (isCurrentMonth) return { ...defaultSlide, tag: 'active', type: 'tbd' };

    const isFuture =
      currentYear > now.getFullYear() ||
      (currentYear === now.getFullYear() && monthIndex > now.getMonth());

    if (isFuture && suggestions.length > 0) {
      const suggestion = suggestions.find((s) => !usedSuggestions.has(s.id));
      if (suggestion) {
        usedSuggestions.add(suggestion.id);
        return {
          ...defaultSlide,
          image: suggestion.image_url ?? '/no-image-placeholder.jpg',
          name: suggestion.name || 'No Theme',
          id: suggestion.id,
          tag: 'suggested',
          type: 'suggestion',
          description: suggestion.option_text,
          created_by: {
            id: suggestion.created_by_user?.id,
            username: suggestion.created_by?.username,
            avatar_url: suggestion.created_by?.avatar_url || '/no-image-placeholder.jpg',
          },
        };
      }
    }

    return defaultSlide;
  });

  return { serverName, serverId, themes: slides };
}
