import { createClient } from '@/lib/supabase/supabase';

export async function createTheme(data: { name: string; description: string; image_url: string; server_id: string; theme_month: string }): Promise<{ id: string }> {
  const supabase = createClient();

  const { data: insertData, error } = await supabase.from('themes').insert([data]).select().single();

  if (error) throw new Error(error.message);
  return insertData;
}

export async function updateTheme(themeId: string, updatedData: { name: string; description: string; image_url: string }) {
  const supabase = createClient();

  const { data, error } = await supabase.from('themes').update(updatedData).eq('id', themeId);

  if (error) throw new Error(error.message);
  return data;
}

export async function promoteTheme(themeData: { name: string; description?: string; image_url?: string; server_id: string; created_by: string; theme_month: string }) {
  const supabase = await createClient();

  const { error } = await supabase.from('themes').insert({
    ...themeData,
    created_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function deletePollOption(pollOptionId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('poll_options').delete().eq('id', pollOptionId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteTheme(themeId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('themes').delete().eq('id', themeId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function uploadThemeImage(serverId: string, file: File, month: string, year: string): Promise<string> {
  const supabase = createClient();

  const monthPadded = month.padStart(2, '0');
  const timestamp = `${year}-${monthPadded}`;

  const filePath = `themes/${serverId}/${timestamp}`;

  const { error: uploadError } = await supabase.storage.from('theme-images').upload(filePath, file, { upsert: true });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: publicUrlData } = supabase.storage.from('theme-images').getPublicUrl(filePath);

  if (!publicUrlData?.publicUrl) throw new Error('Failed to get public URL');

  return `${publicUrlData.publicUrl}?t=${Date.now()}`;
}
