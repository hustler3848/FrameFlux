'use server';

import type { Content, OMDbSearchResponse, OMDbContent } from "@/types";
import { formatContent, initialContentIds } from "@/lib/data";

export async function getContentBySlug(slug: string): Promise<Content | null> {
    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) {
        console.error("OMDb API key is missing on the server.");
        return null;
    }
    const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}`;
    try {
        const response = await fetch(`${apiUrl}&i=${slug}&plot=full`);
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

export async function getInitialContent(): Promise<Content[]> {
    // Using Promise.allSettled to avoid failing the whole batch if one ID is invalid
    const results = await Promise.allSettled(initialContentIds.map(id => getContentBySlug(id)));
    
    return results
      .filter((result): result is PromiseFulfilledResult<Content> => result.status === 'fulfilled' && result.value !== null)
      .map(result => result.value);
}

export async function searchContent(query: string): Promise<Content[]> {
    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey || !query) return [];
    
    const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}`;
    try {
        const response = await fetch(`${apiUrl}&s=${encodeURIComponent(query)}`);
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
