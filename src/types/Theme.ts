import { Slide } from './Slide';

export interface Theme {
  id: string;
  name: string;
  image_url: string;
  start_date: string;
  theme_month: string;
  description?: string;
}

export interface ThemeSliderResult {
  serverName: string | null;
  serverId: string | null;
  themes: Slide[];
}

export interface ThemeCreator {
  username: string | null;
  avatar_url: string | null;
}

export interface Participant {
  username: string | null;
  avatar_url: string | null;
  character_name: string | null;
  character_image: string | null;
}

export interface ThemeDetails {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  theme_month: string;
  status: string | null;
  created_by: ThemeCreator | null;
  likes: number;
  dislikes: number;
  participants: Participant[];
}

export interface FetchThemeDataResponse {
  theme?: ThemeDetails;
  error?: unknown;
}
