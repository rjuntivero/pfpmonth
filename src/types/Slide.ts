export interface Slide {
  month: string;
  year: number;
  image: string;
  name: string;
  id?: string;
  tag?: 'active' | 'suggested' | 'inactive';
  route: string | null;
  type: 'final' | 'poll' | 'tbd';
  description?: string;
}
