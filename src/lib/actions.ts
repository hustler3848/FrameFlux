
'use server';

import type { Content, OMDbSearchResponse, OMDbContent, TMDbFindResponse, TMDbSeriesDetails, TMDbSeasonDetails, Season, Episode } from "@/types";
import { formatContent, initialContentIds } from "@/lib/data";

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function fetchFromOMDb(imdbId: string): Promise<OMDbContent | null> {
    if (!OMDB_API_KEY) {
        console.error("OMDb API key is missing.");
        return null;
    }
    const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbId}&plot=full`;
    try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
            console.error(`OMDb API request failed for ${imdbId} with status: ${response.status}`);
            return null;
        }
        const data = await response.json();
        return data.Response === "True" ? data : null;
    } catch (error) {
        console.error(`Error fetching from OMDb for ${imdbId}:`, error);
        return null;
    }
}


async function fetchSeriesDetailsFromTMDb(imdbId: string): Promise<Content | null> {
    if (!TMDB_API_KEY) {
        console.error("TMDb API key is missing.");
        return null;
    }

    try {
        // 1. Find TMDb ID from IMDb ID
        const findUrl = `${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
        const findResponse = await fetch(findUrl, { cache: 'no-store' });
        if (!findResponse.ok) return null;
        const findData: TMDbFindResponse = await findResponse.json();
        const tmdbId = findData.tv_results?.[0]?.id;
        if (!tmdbId) return null;

        // 2. Fetch TV series details from TMDb
        const seriesUrl = `${TMDB_BASE_URL}/tv/${tmdbId}?api_key=${TMDB_API_KEY}`;
        const seriesResponse = await fetch(seriesUrl, { cache: 'no-store' });
        if (!seriesResponse.ok) return null;
        const seriesData: TMDbSeriesDetails = await seriesResponse.json();
        
        // 3. Fetch details for each season
        const seasonsWithEpisodes: Season[] = await Promise.all(
            seriesData.seasons
                .filter(s => s.season_number > 0) // Exclude "Specials" season
                .map(async (season_summary) => {
                    const seasonUrl = `${TMDB_BASE_URL}/tv/${tmdbId}/season/${season_summary.season_number}?api_key=${TMDB_API_KEY}`;
                    const seasonResponse = await fetch(seasonUrl, { cache: 'no-store' });
                    if (!seasonResponse.ok) return { ...season_summary, episodes: [] };
                    const seasonDetails: TMDbSeasonDetails = await seasonResponse.json();

                    return {
                        season_number: seasonDetails.season_number,
                        name: seasonDetails.name,
                        episode_count: seasonDetails.episodes.length,
                        episodes: seasonDetails.episodes.map(ep => ({
                            episode_number: ep.episode_number,
                            name: ep.name,
                            overview: ep.overview,
                            runtime: ep.runtime || seriesData.episode_run_time?.[0] || 0,
                        })),
                    };
                })
        );
        
        // 4. Format into our unified Content type
        return {
            id: imdbId,
            tmdbId: seriesData.id,
            title: seriesData.name,
            description: seriesData.overview,
            type: seriesData.genres.some(g => g.name === 'Animation') ? 'Anime' : 'Webseries',
            genre: seriesData.genres.map(g => g.name),
            year: new Date(seriesData.first_air_date).getFullYear() || 0,
            rating: Math.round((seriesData.vote_average / 2) * 10) / 10,
            imageUrl: seriesData.poster_path ? `https://image.tmdb.org/t/p/w500${seriesData.poster_path}` : 'https://placehold.co/500x750.png',
            slug: imdbId,
            duration: seriesData.episode_run_time?.[0] || 0,
            totalSeasons: seriesData.number_of_seasons,
            seasons: seasonsWithEpisodes,
        };

    } catch (error) {
        console.error(`Error fetching from TMDb for ${imdbId}:`, error);
        return null;
    }
}


export async function getContentBySlug(slug: string): Promise<Content | null> {
    const omdbData = await fetchFromOMDb(slug);
    if (!omdbData) return null;

    if (omdbData.Type === 'movie') {
        return formatContent(omdbData);
    }
    
    // For series and anime, try getting rich data from TMDb first
    const tmdbSeriesData = await fetchSeriesDetailsFromTMDb(slug);
    if (tmdbSeriesData) {
        return tmdbSeriesData;
    }

    // Fallback to OMDb data if TMDb fails
    return formatContent(omdbData);
}

export async function getInitialContent(): Promise<Content[]> {
    const results = await Promise.allSettled(initialContentIds.map(id => getContentBySlug(id)));
    
    return results
      .filter((result): result is PromiseFulfilledResult<Content> => result.status === 'fulfilled' && result.value !== null)
      .map(result => result.value);
}

export async function searchContent(query: string): Promise<Content[]> {
    if (!OMDB_API_KEY || !query) return [];
    
    const apiUrl = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(apiUrl, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to search content');
        const data: OMDbSearchResponse = await response.json();

        if (data.Response === "True") {
            return data.Search.map(item => ({
                id: item.imdbID,
                title: item.Title,
                description: '', 
                type: item.Type === 'movie' ? 'Movie' : 'Webseries',
                genre: [],
                year: parseInt(item.Year, 10) || 0,
                rating: 0,
                imageUrl: item.Poster !== 'N/A' ? item.Poster.replace('SX300', 'SX600') : 'https://placehold.co/600x900.png',
                slug: item.imdbID,
                duration: 0,
            }));
        }
        return [];
    } catch (error) {
        console.error(`Error searching content for query "${query}":`, error);
        return [];
    }
}
