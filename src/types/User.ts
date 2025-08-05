export interface DiscordUser {
  username: string;
  avatar_url: string;
}

export interface GuildMember {
  discord_users: DiscordUser;
  user_id: string;
}
