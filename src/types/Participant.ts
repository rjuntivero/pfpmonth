export interface Participant {
  id: string;
  character_name: string;
  theme_id: string;
  image_url: string | null;
  user_id: string;
  users: {
    username: string;
    avatar_url: string;
  };
}
