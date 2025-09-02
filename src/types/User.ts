export interface DiscordUser {
  username: string;
  avatar_url: string;
}

export interface GuildMember {
  discord_users: DiscordUser;
  user_id: string;
}

export interface GuildMemberRank {
  discord_users: DiscordUser;
  user_id: string;
  score: number;
  rank: number | null;
  longest_streak: number | null;
  participated: boolean;
  fastestTime: string;
}
