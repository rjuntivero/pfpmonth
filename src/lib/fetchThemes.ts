import { createClient } from '@/utils/supabaseSSR';
import { createPolls } from './createPolls';
import { Slide } from '@/types/Slide';
import { Theme, ThemeSliderResult } from '@/types/Theme';
import { toSlug } from '@/utils/utils';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export async function fetchThemesAndServer(selectedYear: number, serverIdFromCookie?: string): Promise<ThemeSliderResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { serverName: null, serverId: null, themes: [] };
  await createPolls(serverIdFromCookie as string);

  let serverName: string | null = null;
  let resolvedServerId = serverIdFromCookie ?? null;

  if (!resolvedServerId) {
    const { data: userServer } = await supabase.from('user_servers').select('server_id, servers (name)').eq('user_id', user.id).maybeSingle();

    resolvedServerId = userServer?.server_id ?? null;
    serverName = userServer?.servers?.name ?? null;
  } else {
    const { data: server } = await supabase.from('servers').select('name').eq('id', resolvedServerId).single();

    serverName = server?.name ?? null;
  }

  if (!resolvedServerId) return { serverName, serverId: null, themes: [] };

  const now = new Date();
  const currentYear = selectedYear;

  // Fetch official themes
  const { data: themesData = [] } = await supabase.from('themes').select('id, name, image_url, theme_month, description').eq('server_id', resolvedServerId);

  const themes = themesData as Theme[];
  console.log('FETCHED THEMES NOW: ', themes);

  // Fetch centralized poll
  const { data: centralPoll } = await supabase.from('polls').select(`id, poll_options ( id, vote_count, image_url, name, poll_id, created_at )`).eq('server_id', resolvedServerId).is('theme_month', null).maybeSingle();

  const suggestions = (centralPoll?.poll_options ?? []).sort((a, b) => {
    const voteDiff = (b.vote_count ?? 0) - (a.vote_count ?? 0);
    return voteDiff !== 0 ? voteDiff : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const slides: Slide[] = MONTHS.map((monthName, monthIndex) => {
    const month = String(monthIndex + 1).padStart(2, '0');
    const slug = toSlug(monthIndex, currentYear);
    console.log('SLUG: ', slug);
    const isCurrentMonth = now.getFullYear() === currentYear && now.getMonth() === monthIndex;

    const theme = themes.find((t) => t.theme_month?.startsWith(`${currentYear}-${month}`));

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
      };
    }

    if (isCurrentMonth) {
      return {
        month: monthName,
        year: currentYear,
        image: '/no-image-placeholder.jpg',
        name: 'No Theme',
        tag: 'active',
        route: `/themes/month/${slug}`,
        type: 'tbd',
      };
    }

    const suggestionIndex = monthIndex - now.getMonth() - 1;
    const suggestion = suggestionIndex >= 0 ? suggestions[suggestionIndex] : null;
    const isFuture = currentYear > now.getFullYear() || (currentYear === now.getFullYear() && monthIndex > now.getMonth());

    // return theme slide for poll themes
    if (suggestion || isFuture) {
      return {
        month: monthName,
        year: currentYear,
        image: suggestion?.image_url ?? '/no-image-placeholder.jpg',
        name: suggestion?.name,
        id: suggestion?.id,
        tag: 'suggested',
        route: `/themes/month/${slug}`,
        type: 'suggestion',
      };
    }

    return {
      month: monthName,
      year: currentYear,
      image: '/no-image-placeholder.jpg',
      name: 'No Theme',
      tag: 'inactive',
      route: `/themes/month/${slug}`,
      type: 'tbd',
    };
  });

  return { serverName, serverId: resolvedServerId, themes: slides };
}
