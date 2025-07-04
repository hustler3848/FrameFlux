import type { Content, OMDbSearchResponse, OMDbContent } from "@/types";

const API_KEY = process.env.OMDB_API_KEY;
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

// A curated list of popular movies and anime to display on the homepage.
const initialContentIds = [
    "tt1375666", // Inception
    "tt0133093", // The Matrix
    "tt0816692", // Interstellar
    "tt6751668", // Parasite
    "tt0468569", // The Dark Knight
    "tt2560140", // Attack on Titan
    "tt0877057", // Death Note
    "tt1355642", // Fullmetal Alchemist: Brotherhood
    "tt0245429", // Spirited Away
    "tt9335498", // Demon Slayer
];

// Helper to format OMDb API response into our Content type
function formatContent(omdbItem: OMDbContent): Content {
    const type = omdbItem.Type === 'movie' ? 'Movie' : 'Anime'; // Treat 'series' as 'Anime'
    const rating = omdbItem.imdbRating !== 'N/A' ? parseFloat(omdbItem.imdbRating) : 0;
    
    return {
        id: omdbItem.imdbID,
        title: omdbItem.Title,
        description: omdbItem.Plot,
        type: type,
        genre: omdbItem.Genre ? omdbItem.Genre.split(', ') : [],
        year: parseInt(omdbItem.Year, 10) || new Date().getFullYear(),
        rating: Math.round((rating / 2) * 10) / 10, // Scale to 5 stars, one decimal place
        imageUrl: omdbItem.Poster !== 'N/A' ? omdbItem.Poster.replace('SX300', 'SX600') : 'https://placehold.co/600x900.png',
        slug: omdbItem.imdbID, // Using imdbID as the slug
        duration: omdbItem.Runtime !== 'N/A' ? parseInt(omdbItem.Runtime.replace(/ min/g, ''), 10) : 0,
    };
}


export async function getInitialContent(): Promise<Content[]> {
    if (!API_KEY) {
        console.error("OMDb API key is missing. Please add OMDB_API_KEY to your .env.local file.");
        return [];
    }
    // Using Promise.allSettled to avoid failing the whole batch if one ID is invalid
    const results = await Promise.allSettled(initialContentIds.map(id => getContentBySlug(id)));
    
    return results
      .filter((result): result is PromiseFulfilledResult<Content> => result.status === 'fulfilled' && result.value !== null)
      .map(result => result.value);
}


export async function getContentBySlug(slug: string): Promise<Content | null> {
    if (!API_KEY) {
        console.log("OMDb API key is missing.");
        return null;
    }
    try {
        const response = await fetch(`${API_URL}&i=${slug}&plot=full`);
        if (!response.ok) {
            console.error('OMDb API request failed with status:', response.status);
            return null;
        }
        const data: OMDbContent = await response.json();
        if (data.Response === "False") {
            return null;
        };
        return formatContent(data);
    } catch (error) {
        console.error(`Error fetching content for slug (ID) ${slug}:`, error);
        return null;
    }
}

export async function searchContent(query: string): Promise<Content[]> {
    if (!API_KEY || !query) return [];
    try {
        const response = await fetch(`${API_URL}&s=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to search content');
        const data: OMDbSearchResponse = await response.json();

        if (data.Response === "True") {
            return data.Search.map(item => ({
                id: item.imdbID,
                title: item.Title,
                description: '', 
                type: item.Type === 'movie' ? 'Movie' : 'Anime',
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
