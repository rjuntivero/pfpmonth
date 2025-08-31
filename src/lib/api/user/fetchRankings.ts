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
export default async function fetchRankings(chosenMonth: string, chosenYear: string, serverId: string, guildMembers: GuildMemberRank[]): Promise<RankingsResult> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { leaderboard: [], theme: null, availableTimes: [] };
    }

    const monthNumber = monthNames.indexOf(chosenMonth) + 1;
    const monthStr = monthNumber.toString().padStart(2, '0');

    // compute the last day of the month
    const lastDay = new Date(Number(chosenYear), monthNumber, 0).getDate();

    const { data: theme, error: themeError } = await supabase.from('themes').select('*').gte('theme_month', `${chosenYear}-${monthStr}-01`).lte('theme_month', `${chosenYear}-${monthStr}-${lastDay}`).single();

    if (themeError || !theme) {
      console.error('Error fetching theme:', themeError);
      return { leaderboard: [], theme: null, availableTimes: [] };
    }

    const { data: participations, error: participationError } = await supabase.from('user_streaks').select('user_id, streak_count, longest_streak').eq('theme_id', theme.id);

    if (participationError) {
      console.error('Error fetching participations:', participationError);
    }

    // extract guild rankings
    const leaderboard: GuildMemberRank[] = guildMembers.map((member) => {
      const participation = participations?.find((p) => p.user_id === member.user_id);
      return {
        ...member,
        score: participation?.streak_count ?? 0,
        longest_streak: participation?.longest_streak ?? null,
        participated: !!participation,
      };
    });

    leaderboard.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

    // extract available times
    const { data: themeTimes, error: themeTimesError } = await supabase.from('server_theme_calendar').select('year,months').eq('server_id', serverId);
    if (themeTimesError) {
      console.error('Error fetching available themeTimes', themeTimesError);
    }

    console.log('THESE WERE THE THEME TIMES', themeTimes);

    const availableTimes: AvailableTime[] = [];

    themeTimes?.forEach(({ year, months }) => {
      months.forEach((month: number) => {
        availableTimes.push({ year, month });
      });
    });

    return { leaderboard, theme, availableTimes: availableTimes ?? [] };
  } catch (err) {
    console.error('fetchRankings failed:', err);
    return { leaderboard: [], theme: null, availableTimes: [] };
  }
}
