export interface Slide {
  month: string;
  year: number;
  image: string;
  name: string;
  id?: string;
  tag?: 'leading' | 'tbd' | 'most_recent';
  route: string | null;
  type: 'final' | 'poll' | 'tbd';
}
