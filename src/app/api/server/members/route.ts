import { NextResponse } from 'next/server';
import fetchGuild from '@/lib/api/user/fetchGuild';
import { fetchServer } from '@/lib/api/server/fetchServer';

export async function GET() {
  const server = await fetchServer();
  const guildMembers = await fetchGuild(server.data?.server_id as string);

  // members with a user_id come first
  const sortedMembers = guildMembers.sort((a, b) => {
    const aHasUser = a.user_id ? 1 : 0;
    const bHasUser = b.user_id ? 1 : 0;
    return bHasUser - aHasUser;
  });

  return NextResponse.json(sortedMembers);
}
