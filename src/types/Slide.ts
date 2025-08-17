export interface Slide {
  month: string;
  year: number;
  image: string;
  name: string;
  id?: string;
  tag?: string;
  route: string | null;
  type: string;
  description?: string;
  theme_month: string;
  server_id: string;
}
