import { Theme } from './Theme';

export interface PollOption {
  vote_count: number;
  theme_id: string;
  themes: Theme | null;
}

export interface Poll {
  id: string;
  theme_month: string;
  poll_options: PollOption[];
}

export interface UIPoll {
  id: string;
  name: string;
  image_url: string;
  vote_count: number;
  created_by: {
    username: string;
    avatar_url: string;
  };
  created_at: string;
  description: string;
  server_id: string;
  poll_id: string;
  month: string;
  year: string;
  supporters: {
    user_id: string;
    username: string;
    avatar_url: string;
  }[];
}
