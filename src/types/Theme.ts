import { Slide } from './Slide';

export interface Theme {
  id: string;
  name: string;
  image_url: string;
  start_date: string;
  theme_month: string;
  description?: string;
  created_by: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

export interface ThemeSliderResult {
  serverName: string | null;
  serverId: string | null;
  themes: Slide[];
}
