export interface Content {
  id: string;
  title: string;
  description: string;
  type: 'Movie' | 'Anime';
  genre: string[];
  year: number;
  rating: number;
  imageUrl: string;
  slug: string;
  duration: number; // in minutes
}
