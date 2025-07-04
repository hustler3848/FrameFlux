
export interface Content {
  id: string; // This will be the imdbID
  tmdbId?: number; // TMDb ID for fetching season/episode data
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
  seasons?: Season[];
}

export interface Season {
  season_number: number;
  name: string;
  episode_count: number;
  episodes: Episode[];
}

export interface Episode {
  episode_number: number;
  name: string;
  overview: string;
  runtime: number; // in minutes
  // This will be added dynamically on the client
  season_number?: number; 
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

// TMDb Types
export interface TMDbFindResponse {
    movie_results: any[];
    tv_results: { id: number }[];
}

export interface TMDbSeriesDetails {
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    first_air_date: string;
    genres: { id: number; name: string }[];
    vote_average: number;
    number_of_seasons: number;
    episode_run_time: number[];
    seasons: {
        season_number: number;
        episode_count: number;
        name: string;
    }[];
}

export interface TMDbSeasonDetails {
    season_number: number;
    name: string;
    episodes: {
        episode_number: number;
        name: string;
        overview: string;
        runtime: number | null;
    }[];
}

    