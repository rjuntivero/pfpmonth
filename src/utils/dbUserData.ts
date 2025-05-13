import { SupabaseClient } from '@supabase/supabase-js';

export interface Metadata {
  discord_id?: string;
  server_id?: string;
  server_name?: string;
  server_icon?: string;
}

export async function updateSupabaseTables(supabase: SupabaseClient, user: any, metadata: Metadata) {
  const { discord_id, server_id, server_name, server_icon } = metadata;
  const { id, user_metadata } = user;

  // Insert user if not already in `users` table
  const { data: existingUser } = await supabase.from('users').select('id').eq('id', id).maybeSingle();

  if (!existingUser) {
    const { error: insertError } = await supabase.from('users').insert({
      id,
      username: user_metadata?.full_name,
      avatar_url: user_metadata?.avatar_url,
      discord_id: user_metadata?.provider_id,
    });
    if (insertError) console.error('❌ Insert user failed:', insertError.message);
  }

  // Insert server if not exists
  const { data: existingServer } = await supabase.from('servers').select('id').eq('id', server_id).maybeSingle();

  if (!existingServer) {
    const { error: serverInsertError } = await supabase.from('servers').insert({
      id: server_id,
      name: server_name,
      icon_url: server_icon,
    });
    if (serverInsertError) console.error('❌ Insert server failed:', serverInsertError.message);
  }

  // Insert into user_servers
  const { data: existingLink } = await supabase.from('user_servers').select('id').eq('user_id', id).eq('server_id', server_id).maybeSingle();

  if (!existingLink) {
    const { error: linkInsertError } = await supabase.from('user_servers').insert({
      user_id: id,
      discord_id,
      server_id,
    });

    if (linkInsertError) console.error('❌ Link user-server failed:', linkInsertError.message);
  }
}
