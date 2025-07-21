import { createClient } from '@/lib/supabase/supabaseSSR';

export async function uploadThemeImage({ fileName, fileBuffer, serverId }: { fileName: string; fileBuffer: Buffer; serverId: string }) {
  const supabase = await createClient();

  const filePath = `poll-themes/${serverId}/${fileName}`;

  const { error } = await supabase.storage.from('theme-images').upload(filePath, fileBuffer, {
    upsert: true,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage.from('theme-images').getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
