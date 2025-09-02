export interface Slide {
  id?: string;
  name: string;
  month: string;
  image: string;
  description?: string;
  year: number;
  tag?: string;
  route: string | null;
  type: string;
  theme_month: string;
  server_id: string;
}
