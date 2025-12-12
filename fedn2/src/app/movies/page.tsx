"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Filter, MapPin, Search, Star, Ticket } from "lucide-react";
import { movieDetails } from "./data";
import { sendRequest } from "@/utils/api";

const filters = ["All", "Now Showing", "Coming Soon"] as const;

type ApiMovie = {
  id: number;
  title: string;
  slug: string;
  genre: string;
  durationMinutes: number;
  rating: number;
  posterUrl: string;
  format: string;
  status: string;
  description: string;
  showtimes?: { cinema: string; city: string; times: string[] }[];
};

export default function MoviesPage() {
  const [status, setStatus] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<ApiMovie[]>(movieDetails as any);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await sendRequest<IBackendRes<ApiMovie[]>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies`,
          method: "GET",
        });
        if (Array.isArray(res?.data) && res.data.length > 0) {
          const visible = res.data.filter((m) => m.status !== "Hidden");
          setMovies(visible);
        }
      } catch (err) {
        // fallback giữ mock
      }
    };
    fetchMovies();
  }, []);

  const filtered = useMemo(() => {
    return movies.filter((m) => {
      const matchesStatus = status === "All" ? true : m.status === status;
      const matchesQuery = m.title.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [movies, query, status]);

  return (
    <div className="min-h-screen bg-[#020d1e] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,#1d4ed8,transparent_28%),radial-gradient(circle_at_80%_0%,#0ea5e9,transparent_25%),radial-gradient(circle_at_70%_70%,#6b21a8,transparent_24%)] opacity-30 blur-[120px]" />

      <header className="border-b border-white/10 bg-[#020d1e]/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-100/80">Group6</p>
            <h1 className="text-2xl font-bold">Movies</h1>
          </div>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold shadow-[0_12px_32px_-18px_rgba(37,99,235,0.9)] transition hover:bg-blue-500"
          >
            <Ticket className="h-4 w-4" />
            Buy Ticket
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((item) => (
              <button
                key={item}
                onClick={() => setStatus(item)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  status === item
                    ? "border-blue-400/70 bg-blue-500/20 text-white"
                    : "border-white/10 bg-white/5 text-gray-200 hover:border-blue-300/40 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="relative ml-auto w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movie..."
              className="h-10 w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-3 text-sm text-white outline-none ring-1 ring-transparent transition focus:border-blue-400/60"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-gray-300">
            <Filter className="h-5 w-5 text-gray-400" />
            No movies match your filter.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((movie) => (
              <div
                key={movie.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 ring-1 ring-white/10"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={(movie as any).poster || movie.posterUrl}
                    alt={movie.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                  <div className="absolute left-3 top-3 flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-white/10 px-2.5 py-1 font-semibold text-amber-200">
                      <Star className="mr-1 inline h-3.5 w-3.5" />
                      {(movie.rating ?? 0).toFixed(1)}
                    </span>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 font-semibold text-white">
                      {movie.format}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-base font-semibold text-white">{movie.title}</p>
                    <span className="rounded-full bg-blue-600/20 px-2 py-1 text-[10px] font-semibold text-blue-100">
                      {movie.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{movie.genre}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <CalendarDays className="h-4 w-4" />
                    <span>{(movie as any).duration ?? `${movie.durationMinutes}m`}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                    {(movie.showtimes || []).slice(0, 2).map((slot) => (
                      <span
                        key={`${slot.cinema}-${slot.city}`}
                        className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1"
                      >
                        <MapPin className="mr-1 inline h-3.5 w-3.5" />
                        {slot.cinema}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 transition group-hover:opacity-100">
                  <Link
                    href="/booking"
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_40px_-20px_rgba(37,99,235,0.9)] hover:bg-blue-500"
                  >
                    Book ticket
                  </Link>
                  <Link
                    href={`/movies/${movie.slug}`}
                    className="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:border-white/60"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
