import { createClient } from '@/utils/supabaseSSR';

export default async function createNewTheme() {
  const supabase = await createClient();
  return;
}
