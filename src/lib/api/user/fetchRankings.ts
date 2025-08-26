import { createClient } from '@/lib/supabase/supabaseSSR';
import { GuildMember } from '@/types/User';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default async function fetchRankings(chosenMonth: string, chosenYear: string, serverId: string, guildMembers: GuildMember[]) {
  // 1. Select all GuildMembers in the server given serverId
  // 2. Select chosen Theme for selected Month and Year
  // 3. Retrieve ranking information of each member given the theme

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch the selected theme
  const monthNumber = (monthNames.indexOf(chosenMonth) + 1).toString().padStart(2, '0');
  const { data: theme, error: themeError } = await supabase.from('themes').select('*').filter('theme_month', 'gte', `${chosenYear}-${monthNumber}-01`).filter('theme_month', 'lte', `${chosenYear}-${monthNumber}-31`).single();

  // fetch participating users
  const { data: participations, error: participationError } = await supabase.from('user_streaks').select('user_id, score, rank').eq('theme_id', theme.id);

  const leaderboard = guildMembers.map((member) => {
    const participation = participations?.find((p) => p.user_id === member.user_id);
    return {
      ...member,
      score: participation?.score ?? 0,
      rank: participation?.rank ?? null,
      participated: !!participation,
    };
  });

  leaderboard.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}

// themes → stores themes by month and year

// votes or participation → stores which users participated in which theme, with their score or ranking

// 2. Fetch all necessary data efficiently

// You can do 3 queries at most — no need for one per user:

// const supabase = await createClient();

// if (themeError) throw themeError;

// const themeId = theme.id;

// // 3️⃣ Fetch all participations / rankings for that theme
// const { data: participations, error: participationError } = await supabase
//   .from('votes') // or whatever table stores rankings/participation
//   .select('user_id, score, rank') // whatever fields you need
//   .eq('theme_id', themeId);

// if (participationError) throw participationError;

// merge data
// const leaderboard = guildMembers.map(member => {
//   const participation = participations.find(p => p.user_id === member.user_id);

//   return {
//     ...member,
//     score: participation?.score ?? 0, // 0 if not participated
//     rank: participation?.rank ?? null, // null if not ranked
//     participated: !!participation,
//   };
// });

//  sorting
// leaderboard.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
