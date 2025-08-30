import { NextResponse } from 'next/server';
import { fetchServer } from '@/lib/api/server/fetchServer';
import fetchRankings from '@/lib/api/user/fetchRankings';

export async function POST(req: Request) {
  const { chosenMonth, chosenYear, guildData } = await req.json();

  const server = await fetchServer();
  const serverId = server?.server_id;

  const { leaderboard: guildMembers, theme: theme } = await fetchRankings(chosenMonth, chosenYear, serverId as string, guildData);

  if (!guildMembers) {
    return NextResponse.json({ error: 'could not fetch guildMembers' });
  }

  // top users: participants only, sorted by score
  const topUsers = guildMembers
    .filter((m) => m.participated)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // leaderboard: everyone
  const sortedMembers = [...guildMembers].sort((a, b) => b.score - a.score);

  return NextResponse.json({ sortedMembers, topUsers, theme });
}
