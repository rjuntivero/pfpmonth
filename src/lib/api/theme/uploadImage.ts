import { createClient } from '@/lib/supabase/supabaseSSR';

export async function uploadThemeImage({ fileName, fileBuffer, serverId, date }: { fileName: string; fileBuffer: Buffer; serverId: string; date: string }) {
  const supabase = await createClient();
  const parsedDate = new Date(date);
  const formattedDate = `${parsedDate.getFullYear()}-${parsedDate.toLocaleString('default', { month: 'long' })}`;

  // create file path name ex: themes/1234567890/2025-May/theme-image.png
  const filePath = `themes/${serverId}/${formattedDate}/${fileName}`;

  const { error } = await supabase.storage.from('theme-images').upload(filePath, fileBuffer, {
    upsert: true,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage.from('theme-images').getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

export async function uploadPollImage({ fileName, fileBuffer, serverId, date }: { fileName: string; fileBuffer: Buffer; serverId: string; date: string }) {
  const supabase = await createClient();
  const parsedDate = new Date(date);
  const formattedDate = `${parsedDate.getFullYear()}-${parsedDate.toLocaleString('default', { month: 'long' })}`;

  const filePath = `poll-themes/${serverId}/${formattedDate}/${fileName}`;

  const { error } = await supabase.storage.from('theme-images').upload(filePath, fileBuffer, {
    upsert: true,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage.from('theme-images').getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
