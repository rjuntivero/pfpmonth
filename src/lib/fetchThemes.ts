import { createClient } from '@/utils/supabaseSSR';
import { createFuturePolls } from './createFuturePolls';
import { Slide } from '@/types/Slide';
import { Theme, ThemeSliderResult } from '@/types/Theme';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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

  const { data: polls = [] } = await supabase
    .from('polls')
    .select(
      `
      id,
      theme_month,
      poll_options (
        id,
        vote_count,
        image_url,
        name,
        poll_id,
        created_at
      )
    `
    )
    .order('created_at', { referencedTable: 'poll_options', ascending: false });

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
        tag: [],
        route: `/themes/${theme.id}`,
        type: 'final',
      };
    }

    const poll = polls?.find((p) => p.theme_month.startsWith(monthDate));
    if (poll) {
      const options = poll.poll_options ?? [];

      const maxVotes = Math.max(...options.map((opt) => opt.vote_count ?? 0));
      const topVoted = options.filter((opt) => opt.vote_count === maxVotes);

      // Sort ties by created_at DESC (newest wins)
      topVoted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      const optionTheme = topVoted[0] ?? null;
      const isFuture = currentYear > new Date().getFullYear() || (currentYear === new Date().getFullYear() && monthIndex > new Date().getMonth());

      const hasTheme = !!optionTheme?.id;

      const tags: Slide['tag'][] = [];

      if (hasTheme) {
        const isTied = topVoted.length > 1;

        if (isTied) {
          tags.push('most_recent');
        } else {
          tags.push('leading');

          // check if it's also the most recent overall
          const isMostRecent = options[0]?.id === optionTheme.id;

          console.log('JAKE IS THE MOST RECENT: ', isMostRecent);
          if (isMostRecent) tags.push('most_recent');
        }
      } else if (isFuture) {
        tags.push('tbd');
      }

      return {
        month: monthName,
        year: currentYear,
        image: hasTheme ? optionTheme.image_url : '/no-image-placeholder.jpg',
        name: hasTheme ? optionTheme.name : 'No Theme',
        id: hasTheme ? optionTheme.poll_id : poll.id,
        tag: tags,
        route: hasTheme ? `/themes/${optionTheme.poll_id}/vote?month=${monthName}&year=${currentYear}` : isFuture ? `/themes/${poll.id}/vote?month=${monthName}&year=${currentYear}` : null,
        type: hasTheme ? 'poll' : 'tbd',
      };
    }

    return {
      month: monthName,
      year: currentYear,
      image: '/no-image-placeholder.jpg',
      name: 'No Theme',
      tag: [],
      route: null,
      type: 'tbd',
    };
  });

  return { serverName, serverId, themes: slides };
}
