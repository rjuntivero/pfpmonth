import { createClient } from '@/lib/supabase/supabaseSSR';
import { GuildMemberRank } from '@/types/User';
import { ThemeData } from '../theme/fetchThemeData';
import { MONTHS as monthNames } from '@/lib/utils/stringUtils';

export default async function fetchRankings(chosenMonth: string, chosenYear: string, serverId: string, guildMembers: GuildMemberRank[]): Promise<{ leaderboard: GuildMemberRank[]; theme: ThemeData | null }> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { leaderboard: [], theme: null };
    }

    const monthNumber = (monthNames.indexOf(chosenMonth) + 1).toString().padStart(2, '0');
    const { data: theme, error: themeError } = await supabase.from('themes').select('*').filter('theme_month', 'gte', `${chosenYear}-${monthNumber}-01`).filter('theme_month', 'lte', `${chosenYear}-${monthNumber}-31`).single();

    if (themeError || !theme) {
      console.error('Error fetching theme:', themeError);
      return { leaderboard: [], theme: null };
    }

    const { data: participations, error: participationError } = await supabase.from('user_streaks').select('user_id, streak_count, longest_streak').eq('theme_id', theme.id);

    if (participationError) {
      console.error('Error fetching participations:', participationError);
    }

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

    return { leaderboard, theme };
  } catch (err) {
    console.error('fetchRankings failed:', err);
    return { leaderboard: [], theme: null };
  }
}
