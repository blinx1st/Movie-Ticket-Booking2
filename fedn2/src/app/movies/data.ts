export type MovieDetail = {
  id: string;
  title: string;
  slug: string;
  genre: string;
  duration: string;
  rating: number;
  poster: string;
  banner: string;
  format: "2D" | "3D" | "IMAX" | "4DX";
  status: "Now Showing" | "Coming Soon";
  description: string;
  language: string;
  startDate: string;
  endDate?: string;
  trailerUrl?: string;
  showtimes: {
    cinema: string;
    city: string;
    times: string[];
  }[];
};

export const movieDetails: MovieDetail[] = [
  {
    id: "echo",
    title: "Echoes of Tomorrow",
    slug: "echoes-of-tomorrow",
    genre: "Sci-Fi · Thriller",
    duration: "128m",
    rating: 8.8,
    poster:
      "https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?auto=format&fit=crop&w=900&q=80",
    banner:
      "https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=1600&q=80",
    format: "IMAX",
    status: "Now Showing",
    description:
      "A time-bending chase across neon skylines where two timelines collide and only one can survive.",
    language: "English · Sub",
    startDate: "2025-12-05",
    showtimes: [
      { cinema: "Galaxy Central", city: "HCMC", times: ["18:30", "21:00"] },
      { cinema: "Skyline Midtown", city: "HCMC", times: ["20:45"] },
      { cinema: "Aurora Riverside", city: "Da Nang", times: ["19:20"] },
    ],
  },
  {
    id: "solstice",
    title: "Solstice Run",
    slug: "solstice-run",
    genre: "Action · Adventure",
    duration: "114m",
    rating: 8.2,
    poster:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80",
    banner:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1600&q=80",
    format: "4DX",
    status: "Now Showing",
    description:
      "Street racers turned unlikely heroes must outrun a solar storm and deliver a critical payload.",
    language: "English · Dub/Sub",
    startDate: "2025-12-07",
    showtimes: [
      { cinema: "Galaxy Central", city: "HCMC", times: ["17:30", "20:10"] },
      { cinema: "Skyline Midtown", city: "HCMC", times: ["19:00"] },
    ],
  },
  {
    id: "harbor",
    title: "Lumin Harbor",
    slug: "lumin-harbor",
    genre: "Drama · Mystery",
    duration: "102m",
    rating: 8.5,
    poster:
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cd4?auto=format&fit=crop&w=900&q=80",
    banner:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    format: "2D",
    status: "Now Showing",
    description:
      "In a seaside town, a shuttered cinema lights up again, revealing secrets left in the dark.",
    language: "English · Sub",
    startDate: "2025-12-06",
    showtimes: [
      { cinema: "Aurora Riverside", city: "Da Nang", times: ["19:15"] },
      { cinema: "Skyline Midtown", city: "HCMC", times: ["20:40"] },
    ],
  },
  {
    id: "dragon",
    title: "Rise of the Dragon",
    slug: "rise-of-the-dragon",
    genre: "Fantasy · Family",
    duration: "109m",
    rating: 8.1,
    poster:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    banner:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1600&q=80",
    format: "3D",
    status: "Now Showing",
    description:
      "A young rider bonds with the last dragon egg, embarking on a journey across floating isles.",
    language: "English · Dub/Sub",
    startDate: "2025-12-02",
    showtimes: [
      { cinema: "Galaxy Central", city: "HCMC", times: ["16:10", "18:50"] },
      { cinema: "Aurora Riverside", city: "Da Nang", times: ["17:45"] },
    ],
  },
  {
    id: "noir",
    title: "City of Noir",
    slug: "city-of-noir",
    genre: "Crime · Mystery",
    duration: "118m",
    rating: 8.3,
    poster:
      "https://images.unsplash.com/photo-1469594292607-7bd90f8d3ba4?auto=format&fit=crop&w=900&q=80",
    banner:
      "https://images.unsplash.com/photo-1469594292607-7bd90f8d3ba4?auto=format&fit=crop&w=1600&q=80",
    format: "2D",
    status: "Coming Soon",
    description:
      "A detective traces a string of crimes to a lost reel that should never be projected.",
    language: "English · Sub",
    startDate: "2025-12-20",
    endDate: "2026-01-15",
    showtimes: [],
  },
  {
    id: "orbit",
    title: "Orbit Line",
    slug: "orbit-line",
    genre: "Sci-Fi · Drama",
    duration: "124m",
    rating: 8.0,
    poster:
      "https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&w=900&q=80",
    banner:
      "https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&w=1600&q=80",
    format: "IMAX",
    status: "Coming Soon",
    description:
      "An engineer must decide between saving her orbital crew or her family on the ground.",
    language: "English · Sub",
    startDate: "2025-12-28",
    showtimes: [],
  },
  {
    id: "maze",
    title: "Neon Maze",
    slug: "neon-maze",
    genre: "Action · Thriller",
    duration: "106m",
    rating: 7.9,
    poster:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    banner:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    format: "4DX",
    status: "Now Showing",
    description:
      "A courier trapped in a citywide blackout must deliver a code through a maze of gangs.",
    language: "English · Sub",
    startDate: "2025-12-04",
    showtimes: [
      { cinema: "Galaxy Central", city: "HCMC", times: ["21:10"] },
      { cinema: "Skyline Midtown", city: "HCMC", times: ["18:30"] },
    ],
  },
  {
    id: "atlas",
    title: "Atlas Pulse",
    slug: "atlas-pulse",
    genre: "Adventure · Sci-Fi",
    duration: "121m",
    rating: 8.4,
    poster:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80",
    banner:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1600&q=80",
    format: "IMAX",
    status: "Now Showing",
    description:
      "An atlas pilot charts forbidden skies to reconnect lost continents after a magnetic storm.",
    language: "English · Sub",
    startDate: "2025-12-01",
    showtimes: [
      { cinema: "Aurora Riverside", city: "Da Nang", times: ["20:00"] },
      { cinema: "Galaxy Central", city: "HCMC", times: ["19:40"] },
    ],
  },
];
