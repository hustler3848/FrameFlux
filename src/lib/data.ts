import type { Content } from "@/types";
import { slugify } from "./utils";

const titles = [
  // Movies
  "Inception", "The Matrix", "Interstellar", "Parasite", "The Dark Knight",
  "Pulp Fiction", "Forrest Gump", "The Lord of the Rings: The Fellowship of the Ring",
  "Spirited Away", "The Godfather",
  // Anime
  "Attack on Titan", "Death Note", "Fullmetal Alchemist: Brotherhood", "One Punch Man",
  "Naruto: Shippuden", "Your Name", "Demon Slayer", "Jujutsu Kaisen",
  "Cowboy Bebop", "Steins;Gate"
];

const descriptions = {
  "Inception": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
  "The Matrix": "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
  "Interstellar": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
  "Parasite": "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
  "The Dark Knight": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
  "Pulp Fiction": "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
  "Forrest Gump": "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.",
  "The Lord of the Rings: The Fellowship of the Ring": "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
  "Spirited Away": "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
  "The Godfather": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
  "Attack on Titan": "After his hometown is destroyed and his mother is killed, young Eren Yeager vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.",
  "Death Note": "An intelligent high school student goes on a secret crusade to eliminate criminals from the world after discovering a notebook that can kill anyone whose name is written in it.",
  "Fullmetal Alchemist: Brotherhood": "Two brothers search for a Philosopher's Stone after an attempt to revive their deceased mother goes awry and leaves them in damaged physical forms.",
  "One Punch Man": "The story of Saitama, a hero that does it just for fun & can defeat enemies with a single punch.",
  "Naruto: Shippuden": "Naruto Uzumaki, is a loud, hyperactive, adolescent ninja who constantly searches for approval and recognition, as well as to become Hokage, who is acknowledged as the leader and strongest of all ninja in the village.",
  "Your Name": "Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?",
  "Demon Slayer": "A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.",
  "Jujutsu Kaisen": "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman's school to be able to locate the demon's other body parts and thus exorcise himself.",
  "Cowboy Bebop": "The futuristic misadventures and tragedies of an easygoing bounty hunter and his partners.",
  "Steins;Gate": "A group of friends have customized their microwave so that it can send text messages to the past. As they perform different experiments, an organization named SERN who has been doing their own research on time travel tracks them down and now the friends have to find a way to avoid being captured by them."
};

const genres = {
  Movie: ["Sci-Fi", "Action", "Drama", "Crime", "Adventure", "Fantasy", "Animation"],
  Anime: ["Action", "Shounen", "Fantasy", "Thriller", "Sci-Fi", "Drama", "Supernatural", "Mystery"]
};

const types = [
  'Movie', 'Movie', 'Movie', 'Movie', 'Movie', 'Movie', 'Movie', 'Movie', 'Movie', 'Movie',
  'Anime', 'Anime', 'Anime', 'Anime', 'Anime', 'Anime', 'Anime', 'Anime', 'Anime', 'Anime'
];

export const allContent: Content[] = titles.map((title, index) => {
  const type = types[index] as 'Movie' | 'Anime';
  return {
    id: (index + 1).toString(),
    title: title,
    description: descriptions[title as keyof typeof descriptions],
    type: type,
    genre: [
      genres[type][index % genres[type].length],
      genres[type][(index + 1) % genres[type].length]
    ],
    year: 2024 - (index % 15),
    rating: Math.round((4 + Math.random()) * 10) / 10, // 4.0 to 5.0
    imageUrl: `https://placehold.co/600x900.png`,
    slug: slugify(title),
    duration: type === 'Movie' 
      ? Math.floor(Math.random() * 71) + 110 // 110-180 min
      : Math.floor(Math.random() * 61) + 90, // 90-150 min
  };
});
