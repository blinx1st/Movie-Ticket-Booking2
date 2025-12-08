import { movieDetails } from "@/app/movies/data";

export type Booking = {
  id: string;
  userName: string;
  userEmail: string;
  movieSlug: string;
  cinema: string;
  seats: string[];
  amount: number;
  status: "PAID" | "PENDING" | "CANCELLED";
  createdAt: string;
  showtime: string;
};

export const mockBookings: Booking[] = [
  {
    id: "BK-1001",
    userName: "Jane Doe",
    userEmail: "jane@example.com",
    movieSlug: "echoes-of-tomorrow",
    cinema: "Galaxy Central · HCMC",
    seats: ["B3", "B4"],
    amount: 23.8,
    status: "PAID",
    createdAt: "2025-12-05 18:10",
    showtime: "2025-12-05 18:30",
  },
  {
    id: "BK-1002",
    userName: "Jane Doe",
    userEmail: "jane@example.com",
    movieSlug: "solstice-run",
    cinema: "Galaxy Central · HCMC",
    seats: ["C1", "C2", "C3"],
    amount: 30.6,
    status: "PENDING",
    createdAt: "2025-12-06 17:00",
    showtime: "2025-12-06 17:30",
  },
  {
    id: "BK-1003",
    userName: "Jane Doe",
    userEmail: "jane@example.com",
    movieSlug: "lumin-harbor",
    cinema: "Aurora Riverside · Da Nang",
    seats: ["A1"],
    amount: 8.4,
    status: "CANCELLED",
    createdAt: "2025-12-04 19:45",
    showtime: "2025-12-04 20:15",
  },
];

export function resolveMovieTitle(slug: string) {
  return movieDetails.find((m) => m.slug === slug)?.title ?? slug;
}
