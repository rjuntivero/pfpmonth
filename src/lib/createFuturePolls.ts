import { createClient } from '@/utils/supabaseSSR';

const MONTHS = Array.from({ length: 12 }, (_, i) => i);

export async function createFuturePolls(serverId: string): Promise<void> {
  const supabase = await createClient();

  const { data: existingPolls = [] } = await supabase.from('polls').select('theme_month').eq('server_id', serverId);

  const existingMonths = new Set(existingPolls?.map((p) => p.theme_month.split('T')[0]));

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const missingPolls = MONTHS.map((monthIndex) => {
    const isFuture = currentYear > now.getFullYear() || (currentYear === now.getFullYear() && monthIndex > currentMonth);
    if (!isFuture) return null;

    const dateStr = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}-01`;
    if (existingMonths.has(dateStr)) return null;

    return {
      theme_month: dateStr,
      server_id: serverId,
    };
  }).filter(Boolean);

  if (missingPolls.length > 0) {
    await supabase.from('polls').insert(missingPolls);
  }
}
