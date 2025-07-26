import { NextResponse } from 'next/server';
import fetchUserData from '@/lib/api/user/fetchUserData';

export async function GET(req: Request) {
  const user = await fetchUserData();

  return NextResponse.json({ success: true, user: user });
}
