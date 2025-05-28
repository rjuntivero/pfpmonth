export interface Slide {
  month: string;
  year: number;
  image: string;
  name: string;
  id?: string;
  tag?: string;
  route: string | null;
  type: 'final' | 'poll' | 'tbd';
  description?: string;
}
