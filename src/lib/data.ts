import type { Content, OMDbContent } from "@/types";

// A curated list of popular movies and anime to display on the homepage.
export const initialContentIds = [
    // Existing popular movies
    "tt1375666", // Inception (2010)
    "tt0816692", // Interstellar (2014)
    "tt0468569", // The Dark Knight (2008)
    "tt4633694", // Spider-Man: Into the Spider-Verse (2018)
    
    // Recent popular movies
    "tt15239678", // Dune: Part Two (2024)
    "tt15398776", // Oppenheimer (2023)
    "tt1517268", // Barbie (2023)
    "tt9362722", // Spider-Man: Across the Spider-Verse (2023)
    "tt6710474", // Everything Everywhere All at Once (2022)
    "tt1745960", // Top Gun: Maverick (2022)
    "tt1877830", // The Batman (2022)
    "tt23289160", // Godzilla Minus One (2023)
    "tt6751668", // Parasite (2019)
    "tt1160419", // Dune (2021)

    // Existing popular anime
    "tt2560140", // Attack on Titan
    "tt0877057", // Death Note
    "tt1355642", // Fullmetal Alchemist: Brotherhood
    "tt0245429", // Spirited Away
    "tt9335498", // Demon Slayer
    "tt12343534", // Jujutsu Kaisen
    "tt5311514", // Your Name.

    // Recent popular anime
    "tt29613018", // Frieren: Beyond Journey's End (2023)
    "tt12590266", // Cyberpunk: Edgerunners (2022)
    "tt13616990", // Chainsaw Man (2022)
    "tt23963188", // Oshi no Ko (2023)
    "tt13790832", // Spy x Family (2022)
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
