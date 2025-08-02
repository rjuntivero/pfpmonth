import { NextResponse } from 'next/server';
import fetchGuild from '@/lib/api/user/fetchGuild';
import { fetchServer } from '@/lib/api/server/fetchServer';

export async function GET() {
  const server = await fetchServer();
  const guildMembers = await fetchGuild(server.data?.server_id);

  return NextResponse.json(guildMembers);
}
