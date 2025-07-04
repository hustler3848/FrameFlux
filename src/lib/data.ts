import type { Content, OMDbContent } from "@/types";

// A curated list of popular movies and anime to display on the homepage.
export const initialContentIds = [
    "tt1375666", // Inception
    "tt0133093", // The Matrix
    "tt0816692", // Interstellar
    "tt6751668", // Parasite
    "tt0468569", // The Dark Knight
    "tt0111161", // The Shawshank Redemption
    "tt0110912", // Pulp Fiction
    "tt4633694", // Spider-Man: Into the Spider-Verse
    "tt0120737", // The Lord of the Rings: The Fellowship of the Ring
    "tt0109830", // Forrest Gump
    "tt2560140", // Attack on Titan
    "tt0877057", // Death Note
    "tt1355642", // Fullmetal Alchemist: Brotherhood
    "tt0245429", // Spirited Away
    "tt9335498", // Demon Slayer
    "tt0213338", // Cowboy Bebop
    "tt1910272", // Steins;Gate
    "tt12343534", // Jujutsu Kaisen
    "tt5311514", // Your Name.
    "tt4508902", // One Punch Man
];

// Helper to format OMDb API response into our Content type
export function formatContent(omdbItem: OMDbContent): Content {
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
