"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, Film, MapPin, Star, Ticket, Video } from "lucide-react";
import { movieDetails } from "../data";
import { sendRequest } from "@/utils/api";

type MovieDetailApi = {
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
  language: string;
  startDate?: string;
  releaseDate?: string;
  trailerUrl?: string;
  showtimes?: {
    cinema: string;
    city: string;
    times: string[];
  }[];
};

export default function MovieDetailPage() {
  const params = useParams();
  const slug = useMemo(() => (params?.slug ? String(params.slug) : ""), [params]);

  const [movie, setMovie] = useState<MovieDetailApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const res = await sendRequest<IBackendRes<MovieDetailApi>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies/${slug}`,
          method: "GET",
        });
        if (res?.data) {
          setMovie(res.data);
          setNotFoundFlag(false);
          return;
        }
        setNotFoundFlag(true);
      } catch (err) {
        const fallback = movieDetails.find((item) => item.slug === slug);
        if (fallback) {
          setMovie(fallback as any);
          setNotFoundFlag(false);
        } else {
          setNotFoundFlag(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [slug]);

  const poster = movie?.posterUrl || (movie as any)?.poster;
  const banner = movie?.bannerUrl || (movie as any)?.banner || poster;
  const duration =
    (movie as any)?.duration ||
    (movie?.durationMinutes ? `${movie.durationMinutes}m` : undefined) ||
    "";
  const release =
    movie?.startDate ||
    (movie as any)?.startDate ||
    (movie as any)?.releaseDate ||
    (movie?.releaseDate as any) ||
    "";

  if (!slug) return null;

  if (!movie && !loading) {
    return (
      <div className="min-h-screen bg-[#020d1e] text-white flex items-center justify-center">
        <p className="text-lg text-gray-300">Movie not found.</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#020d1e] text-white flex items-center justify-center">
        <p className="text-lg text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020d1e] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,#1d4ed8,transparent_28%),radial-gradient(circle_at_80%_0%,#0ea5e9,transparent_25%),radial-gradient(circle_at_70%_70%,#6b21a8,transparent_24%)] opacity-30 blur-[120px]" />

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
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 ring-1 ring-white/10">
          <div className="absolute inset-0">
            <img
              src={banner}
              alt={movie.title}
              className="h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#020d1e] via-[#020d1e]/85 to-[#020d1e]/40" />
          </div>

          <div className="relative grid gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-12">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                  {movie.status}
                </span>
                <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-200">
                  <Star className="h-4 w-4" />
                  {(movie.rating ?? 0).toFixed(1)}
                </span>
              </div>
              <h1 className="text-4xl font-black leading-tight md:text-5xl">{movie.title}</h1>
              <p className="text-lg text-gray-200/90">{movie.description}</p>
              <div className="flex flex-wrap gap-3 text-sm text-gray-200">
                <span className="rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/10">
                  {movie.genre}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/10">
                  {duration}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/10">
                  {movie.format}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/10">
                  {movie.language}
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
                {movie.trailerUrl && (
                  <a
                    href={movie.trailerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-gray-100 transition hover:border-white/40"
                  >
                    <Video className="h-4 w-4" />
                    Watch trailer
                  </a>
                )}
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/10">
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={poster}
                  alt={movie.title}
                  className="h-72 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-gray-200">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Multi-cinema release
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 font-semibold">
                    {movie.format}
                  </span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-300">
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-gray-400">Start date</p>
                  <p className="font-semibold text-white">{release}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-gray-400">Status</p>
                  <p className="font-semibold text-white">{movie.status}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
                <CalendarDays className="h-4 w-4" />
                Showtimes
              </div>
              <Link
                href="/booking"
                className="text-xs font-semibold text-blue-300 hover:text-white"
              >
                Go to booking
              </Link>
            </div>
            {!movie.showtimes || movie.showtimes.length === 0 ? (
              <p className="mt-4 text-sm text-gray-400">
                Showtimes are being scheduled. Please check back soon.
              </p>
            ) : (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {movie.showtimes?.map((slot, idx) => (
                  <div
                    key={`${slot.cinema}-${idx}`}
                    className="space-y-2 rounded-xl border border-white/10 bg-slate-900/60 p-4"
                  >
                    <div className="flex items-center justify-between text-sm text-white">
                      <span className="font-semibold">{slot.cinema}</span>
                      <span className="text-xs text-gray-400">{slot.city}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {slot.times.map((time) => (
                        <span
                          key={time}
                          className="rounded-lg border border-white/15 px-3 py-1 text-xs font-semibold text-gray-100"
                        >
                          <Clock3 className="mr-1 inline h-3.5 w-3.5" />
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-900/30 to-slate-950 p-6 ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
                <Star className="h-4 w-4" />
                Quick facts
              </div>
              <Link
                href="/booking"
                className="text-xs font-semibold text-blue-300 hover:text-white"
              >
                Buy ticket
              </Link>
            </div>
            <div className="mt-4 space-y-3 text-sm text-gray-200">
              <div className="flex justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                <span className="text-gray-400">Rating</span>
                <span className="font-semibold text-white">{(movie.rating ?? 0).toFixed(1)}</span>
              </div>
              <div className="flex justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                <span className="text-gray-400">Format</span>
                <span className="font-semibold text-white">{movie.format}</span>
              </div>
              <div className="flex justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                <span className="text-gray-400">Language</span>
                <span className="font-semibold text-white">{movie.language}</span>
              </div>
              <div className="flex justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                <span className="text-gray-400">Duration</span>
                <span className="font-semibold text-white">{duration}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
