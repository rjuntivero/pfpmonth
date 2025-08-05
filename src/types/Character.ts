export type Character = {
  name: string;
  id: string;
  theme_id: string;
  user_id: string;
  image_url: string;
};

export type ClaimedCharacter = { character_name: string; claimed: boolean };
