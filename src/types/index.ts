export interface Content {
  id: string; // This will be the imdbID
  title: string;
  description: string;
  type: 'Movie' | 'Anime' | 'Webseries';
  genre: string[];
  year: number;
  rating: number; // Will be 0-5 scale
  imageUrl: string;
  slug: string; // Kept for consistency, will also be imdbID
  duration: number; // in minutes for movies, or per-episode for series
  totalSeasons?: number; // for series
}

// Type for the OMDb search results list
export interface OMDbSearchItem {
    Title: string;
    Year: string;
    imdbID: string;
    Type: 'movie' | 'series' | 'episode';
    Poster: string;
}

export interface OMDbSearchResponse {
    Search: OMDbSearchItem[];
    totalResults: string;
    Response: 'True' | 'False';
    Error?: string;
}

// Type for a full content response from OMDb
export interface OMDbContent {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: { Source: string; Value: string }[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: 'movie' | 'series' | 'episode';
    totalSeasons?: string;
    DVD?: string;
    BoxOffice?: string;
    Production?: string;
    Website?: string;
    Response: 'True' | 'False';
    Error?: string;
}
