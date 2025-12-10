"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Film,
  MapPin,
  Play,
  Star,
  Ticket,
} from "lucide-react";
import { sendRequest } from "@/utils/api";

type ApiMovie = {
  id: number;
  title: string;
  slug: string;
  genre: string;
  durationMinutes: number;
  rating: number;
  posterUrl: string;
  bannerUrl?: string;
  format: string;
  status: string;
  description: string;
};

export default function HomePage() {
  const { data: session } = useSession();
  const [activeIdx, setActiveIdx] = useState(0);
  const [movies, setMovies] = useState<ApiMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % (movies.length || 1));
    }, 6000);
    return () => clearInterval(id);
  }, [movies.length]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await sendRequest<IBackendRes<ApiMovie[]>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies`,
          method: "GET",
          queryParams: { status: "Now Showing", limit: 8 },
        });
        if (Array.isArray(res?.data) && res.data.length > 0) {
          setMovies(res.data);
          setActiveIdx(0);
        } else {
          setMovies([]);
        }
      } catch (err: any) {
        setError("Unable to load movies.");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020d1e] text-white flex items-center justify-center">
        <p className="text-lg text-gray-300">Loading movies...</p>
      </div>
    );
  }

  if (!loading && movies.length === 0) {
    return (
      <div className="min-h-screen bg-[#020d1e] text-white flex items-center justify-center">
        <p className="text-lg text-gray-300">
          {error || "No movies available. Please add movies in admin panel."}
        </p>
      </div>
    );
  }

  const activeMovie = movies[Math.min(activeIdx, movies.length - 1)] ?? movies[0];
  const nowShowing = movies.filter((m) => m.status === "Now Showing").slice(0, 8);

  return (
    <div className="relative min-h-screen bg-[#020d1e] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,#1d4ed8,transparent_28%),radial-gradient(circle_at_80%_0%,#0ea5e9,transparent_25%),radial-gradient(circle_at_70%_70%,#6b21a8,transparent_24%)] opacity-40 blur-[120px]" />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#020d1e]/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600/20 p-2 text-blue-100 ring-1 ring-blue-500/40">
              <Film className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-100/80">Group6</p>
              <p className="text-lg font-semibold">Booking-Movie-Ticket</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-gray-200 md:flex">
            <Link href="/movies" className="hover:text-white">
              Movies
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
            <Link href="/booking" className="hover:text-white">
              Buy Ticket
            </Link>
          </nav>

          <div className="flex items-center gap-3 text-sm">
            {!session?.user ? (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-full border border-white/15 px-4 py-2 font-semibold hover:border-white/40"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-full bg-blue-600 px-4 py-2 font-semibold text-white shadow-[0_10px_30px_-12px_rgba(37,99,235,0.8)] hover:bg-blue-500"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-white/15 px-4 py-2 font-semibold text-gray-100 bg-white/5">
                  Xin chào, {(session.user as any)?.name || (session.user as any)?.email || "User"}
                </span>
                <Link
                  href="/user/profile"
                  className="rounded-full bg-blue-600 px-4 py-2 font-semibold text-white shadow-[0_10px_30px_-12px_rgba(37,99,235,0.8)] hover:bg-blue-500"
                >
                  Profile
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                  className="rounded-full border border-white/20 px-4 py-2 font-semibold text-gray-100 hover:border-white/40"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-14">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 ring-1 ring-white/10">
          <div className="absolute inset-0">
            <img
              src={activeMovie.bannerUrl || activeMovie.posterUrl}
              alt={activeMovie.title}
              className="h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#020d1e] via-[#020d1e]/80 to-[#020d1e]/40" />
          </div>

          <div className="relative grid gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-12">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                  Hot movie
                </span>
                <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-200">
                  <Star className="h-4 w-4" />
                  {(activeMovie.rating ?? 0).toFixed(1)}
                </span>
              </div>
              <h1 className="text-4xl font-black leading-tight md:text-5xl">{activeMovie.title}</h1>
              <p className="text-lg text-gray-200/90">
                Book premium seats, choose formats (2D/3D/IMAX/4DX), and pay with a mock QR flow.
                Built by Group 6
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-gray-200">
                <span className="rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/10">
                  {activeMovie.genre}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/10">
                  {`${activeMovie.durationMinutes}m`}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/10">
                  {activeMovie.format}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold shadow-[0_18px_40px_-24px_rgba(37,99,235,0.9)] transition hover:bg-blue-500"
                >
                  <Ticket className="h-4 w-4" />
                  Book ticket
                </Link>
                <Link
                  href={`/movies/${activeMovie.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-gray-100 transition hover:border-white/40"
                >
                  <Play className="h-4 w-4" />
                  Details
                </Link>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/10">
              <div className="flex items-center justify-between px-2 pb-3 text-sm text-gray-300">
                <span className="flex items-center gap-2 font-semibold">
                  <Clapperboard className="h-4 w-4" />
                  Hero carousel
                </span>
                <span className="text-xs text-gray-400">Auto rotates every 6s</span>
              </div>
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={activeMovie.posterUrl}
                  alt={activeMovie.title}
                  className="h-64 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-gray-200">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Available at all cinemas
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 font-semibold">
                    {activeMovie.format}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Previous"
                    onClick={() =>
                      setActiveIdx((prev) => (prev - 1 + movies.length) % movies.length)
                    }
                    className="rounded-full border border-white/20 p-2 hover:border-white/50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Next"
                    onClick={() => setActiveIdx((prev) => (prev + 1) % movies.length)}
                    className="rounded-full border border-white/20 p-2 hover:border-white/50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {movies.map((movie, idx) => (
                    <button
                      key={movie.id}
                      aria-label={`Go to ${movie.title}`}
                      onClick={() => setActiveIdx(idx)}
                      className={`h-2.5 w-6 rounded-full transition ${
                        idx === activeIdx ? "bg-blue-400" : "bg-white/15 hover:bg-white/35"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-1.5 rounded-full bg-blue-600" />
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-blue-100">Now showing</p>
                <h2 className="text-2xl font-bold">Grab tickets today</h2>
              </div>
            </div>
            <Link
              href="/movies"
              className="text-sm font-semibold text-blue-300 hover:text-white"
            >
              View all
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {nowShowing.map((movie) => (
              <div
                key={movie.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 ring-1 ring-white/10"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={movie.posterUrl}
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
                    <span>{`${movie.durationMinutes}m`}</span>
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
        </section>
      </main>

      <footer className="mt-12 border-t border-white/10 bg-[#020915] px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold">Group6 Cinema Network</p>
            <p className="text-sm text-gray-400">
              Hotline: 1900-123-456 or Email: support@group6cinema.com
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              12 Nguyen Hue, HCMC
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              25 Bach Dang, Da Nang
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
