import { createClient } from '@/utils/supabaseSSR';
import { createFuturePolls } from './createFuturePolls';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface Theme {
  id: string;
  name: string;
  image_url: string;
  start_date: string;
}

interface PollOption {
  vote_count: number;
  theme_id: string;
  themes: Theme | null;
}

interface Poll {
  id: string;
  theme_month: string;
  poll_options: PollOption[];
}

interface Slide {
  month: string;
  year: number;
  image: string;
  name: string;
  id?: string;
  tag?: 'leading' | 'tbd';
  route: string | null;
  type: 'final' | 'poll' | 'tbd';
}

interface ThemeSliderResult {
  serverName: string | null;
  serverId: string | null;
  themes: Slide[];
}

export async function fetchThemesAndServer(): Promise<ThemeSliderResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { serverName: null, serverId: null, themes: [] };
  await createFuturePolls();

  const { data: userServer } = await supabase.from('user_servers').select('server_id, servers (name)').eq('user_id', user.id).maybeSingle();

  const serverName = userServer?.servers?.name ?? null;
  const serverId = userServer?.server_id ?? null;

  if (!serverId) return { serverName, serverId, themes: [] };

  const currentYear = new Date().getFullYear();

  const { data: themesData = [] } = await supabase.from('themes').select('id, name, image_url, start_date').eq('server_id', serverId);

  const themes = themesData as Theme[];

  const { data: rawPolls = [] } = await supabase.from('polls').select('*');

  const parsedPolls = rawPolls as Poll[];

  const slides: Slide[] = MONTHS.map((monthName, monthIndex) => {
    const month = String(monthIndex + 1).padStart(2, '0');
    const monthDate = `${currentYear}-${month}`;

    const theme = themes.find((t) => t.start_date.startsWith(monthDate));
    if (theme) {
      return {
        month: monthName,
        year: currentYear,
        image: theme.image_url,
        name: theme.name,
        id: theme.id,
        tag: undefined,
        route: `/themes/${theme.id}`,
        type: 'final',
      };
    }

    const poll = parsedPolls.find((p) => p.theme_month.startsWith(monthDate));
    if (poll) {
      const leading = poll.poll_options?.length > 0 ? [...poll.poll_options].sort((a, b) => b.vote_count - a.vote_count)[0] : null;

      const optionTheme = leading?.themes ?? null;

      const isFuture = currentYear > new Date().getFullYear() || (currentYear === new Date().getFullYear() && monthIndex > new Date().getMonth());

      const hasTheme = !!optionTheme?.id;

      return {
        month: monthName,
        year: currentYear,
        image: hasTheme ? optionTheme.image_url : '/no-image-placeholder.jpg',
        name: hasTheme ? optionTheme.name : 'No Theme',
        id: hasTheme ? optionTheme.id : poll.id,
        tag: hasTheme ? 'leading' : isFuture ? 'tbd' : undefined,
        route: hasTheme ? `/themes/${optionTheme.id}/vote` : isFuture ? `/themes/${poll.id}/vote` : null,
        type: hasTheme ? 'poll' : 'tbd',
      };
    }

    return {
      month: monthName,
      year: currentYear,
      image: '/no-image-placeholder.jpg',
      name: 'No Theme',
      tag: undefined,
      route: null,
      type: 'tbd',
    };
  });

  return { serverName, serverId, themes: slides };
}
