import { Slide } from './Slide';

export interface Theme {
  id: string;
  name: string;
  image_url: string;
  start_date: string;
}

export interface ThemeSliderResult {
  serverName: string | null;
  serverId: string | null;
  themes: Slide[];
}
