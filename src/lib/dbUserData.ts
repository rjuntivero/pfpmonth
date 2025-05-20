import { SupabaseClient, User } from '@supabase/supabase-js';

export interface Metadata {
  discord_id?: string;
  server_id?: string;
  server_name?: string;
  server_icon?: string;
}

export async function updateSupabaseTables(supabase: SupabaseClient, user: User, metadata: Metadata) {
  const { discord_id, server_id, server_name, server_icon } = metadata;
  const { id, user_metadata } = user;

  if (!discord_id) return;

  // update existing user row with Supabase Auth ID (user.id)
  const { error: updateUserError } = await supabase
    .from('users')
    .update({
      id,
      username: user_metadata?.full_name,
      avatar_url: user_metadata?.avatar_url,
    })
    .eq('discord_id', discord_id);

  if (updateUserError) console.error('❌ Update user failed:', updateUserError.message);

  // upsert server
  if (server_id) {
    const { error: serverInsertError } = await supabase.from('servers').upsert({
      id: server_id,
      name: server_name,
      icon_url: server_icon,
    });

    if (serverInsertError) console.error('❌ Upsert server failed:', serverInsertError.message);
  }

  // upsert user_servers row for CURRENT user using discord_id
  if (server_id) {
    const { error: linkInsertError } = await supabase.from('user_servers').upsert(
      {
        user_id: id,
        discord_id,
        server_id,
      },
      {
        onConflict: 'discord_id,server_id',
      }
    );

    if (linkInsertError) console.error('❌ Upsert user-server failed:', linkInsertError.message);
  }
}
