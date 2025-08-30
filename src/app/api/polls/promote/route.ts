// /app/api/promoteThemes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { promoteAssignedSuggestionsToThemes } from '@/lib/api/poll/pollActions';
import { MonthSlotType } from '@/components/layout/ThemeOverviewPanel/SuggestionsCalendar/SuggestionsCalendar';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { months, year, serverId } = body as { months: MonthSlotType[]; year: number; serverId: string };

    await promoteAssignedSuggestionsToThemes(months, year, serverId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: (err as Error).message });
  }
}
