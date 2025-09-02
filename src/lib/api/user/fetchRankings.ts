import { createClient } from '@/lib/supabase/supabaseSSR';
import { GuildMemberRank } from '@/types/User';
import { ThemeData } from '../theme/fetchThemeData';
import { MONTHS as monthNames } from '@/lib/utils/stringUtils';

export interface AvailableTime {
  year: number;
  month: number;
}

interface RankingsResult {
  leaderboard: GuildMemberRank[];
  theme: ThemeData | null;
  availableTimes: AvailableTime[] | [];
}

export type RankingType = 'All Time' | 'Monthly' | null;

export default async function fetchRankings(chosenMonth: string, chosenYear: string, serverId: string, guildMembers: GuildMemberRank[], rankingType: RankingType): Promise<RankingsResult> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { leaderboard: [], theme: null, availableTimes: [] };

    // fetch all available years and months
    const { data: themeTimes, error: themeTimesError } = await supabase.from('server_theme_calendar').select('year, months').eq('server_id', serverId);

    if (themeTimesError) {
      console.error('Error fetching available themeTimes', themeTimesError);
      return { leaderboard: [], theme: null, availableTimes: [] };
    }

    const availableTimes: AvailableTime[] = [];
    themeTimes?.forEach(({ year, months }) => {
      months.forEach((month: number) => availableTimes.push({ year, month }));
    });

    // filter months for the chosen year
    const monthsForYear = availableTimes
      .filter((t) => t.year.toString() === chosenYear)
      .map((t) => t.month)
      .sort((a, b) => a - b);

    if (!monthsForYear.length) {
      console.warn('No months available for selected year');
      return { leaderboard: [], theme: null, availableTimes };
    }

    // determine month to query
    let monthNumber = monthNames.indexOf(chosenMonth) + 1;
    if (!monthsForYear.includes(monthNumber)) {
      // pick first available month if invalid
      monthNumber = monthsForYear[0];
      // update chosenMonth to match
      chosenMonth = monthNames[monthNumber - 1];
    }

    const monthStr = monthNumber.toString().padStart(2, '0');
    const lastDay = new Date(Number(chosenYear), monthNumber, 0).getDate();

    // query theme safely
    const { data: theme, error: themeError } = await supabase.from('themes').select('*').gte('theme_month', `${chosenYear}-${monthStr}-01`).lte('theme_month', `${chosenYear}-${monthStr}-${lastDay}`).single();

    if (themeError || !theme) {
      console.error('Error fetching theme:', themeError);
      return { leaderboard: [], theme: null, availableTimes };
    }

    // fetch participations and compute leaderboard
    let leaderboard: GuildMemberRank[] = [];
    if (rankingType === 'All Time') {
      // global: across server
      const { data: participations, error } = await supabase.from('user_streaks').select('user_id, streak_count, longest_streak').eq('server_id', serverId);

      if (error) console.error('Error fetching all-time participations:', error);

      leaderboard = guildMembers.map((member) => {
        const participation = participations?.find((p) => p.user_id === member.user_id);
        return {
          ...member,
          score: participation?.streak_count ?? 0,
          longest_streak: participation?.longest_streak ?? null,
          participated: !!participation,
        };
      });

      leaderboard.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    } else if (rankingType === 'Monthly') {
      const { data: participations, error } = await supabase.from('user_characters').select('user_id, created_at').eq('theme_id', theme.id).order('created_at', { ascending: true });

      if (error) console.error('Error fetching fastest participations:', error);

      leaderboard = guildMembers.map((member) => {
        const participation = participations?.find((p) => p.user_id === member.user_id);
        return {
          ...member,
          // rank by order of participation
          score: participation ? 1 : 0,
          fastestTime: participation?.created_at ?? null,
          participated: !!participation,
        };
      });

      // sort: earliest participation first
      leaderboard.sort((a, b) => {
        if (!a.fastestTime) return 1;
        if (!b.fastestTime) return -1;
        return new Date(a.fastestTime).getTime() - new Date(b.fastestTime).getTime();
      });
    }
    return { leaderboard, theme, availableTimes };
  } catch (err) {
    console.error('fetchRankings failed:', err);
    return { leaderboard: [], theme: null, availableTimes: [] };
  }
}
