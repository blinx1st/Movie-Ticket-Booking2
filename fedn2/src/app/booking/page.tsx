"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Armchair,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Film,
  HandCoins,
  Loader2,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  Wallet,
} from "lucide-react";

type Movie = {
  id: string;
  title: string;
  genre: string;
  duration: string;
  rating: number;
  poster: string;
  format: "2D" | "3D" | "IMAX" | "4DX";
};

type Cinema = {
  id: string;
  name: string;
  address: string;
  city: string;
};

type Showtime = {
  id: string;
  movieId: string;
  cinemaId: string;
  startTime: string;
  format: Movie["format"];
  basePrice: number;
  heldSeats: string[];
  soldSeats: string[];
};

const movies: Movie[] = [
  {
    id: "echo",
    title: "Echoes of Tomorrow",
    genre: "Sci-Fi · Thriller",
    duration: "128m",
    rating: 8.8,
    poster:
      "https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?auto=format&fit=crop&w=900&q=80",
    format: "IMAX",
  },
  {
    id: "solstice",
    title: "Solstice Run",
    genre: "Action · Adventure",
    duration: "114m",
    rating: 8.2,
    poster:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80",
    format: "4DX",
  },
  {
    id: "harbor",
    title: "Lumin Harbor",
    genre: "Drama · Mystery",
    duration: "102m",
    rating: 8.5,
    poster:
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cd4?auto=format&fit=crop&w=900&q=80",
    format: "2D",
  },
];

const cinemas: Cinema[] = [
  { id: "galaxy", name: "Galaxy Central", address: "12 Nguyen Hue", city: "HCMC" },
  { id: "aurora", name: "Aurora Riverside", address: "25 Bach Dang", city: "Da Nang" },
  { id: "skyline", name: "Skyline Midtown", address: "88 Le Loi", city: "HCMC" },
];

const showtimes: Showtime[] = [
  {
    id: "st1",
    movieId: "echo",
    cinemaId: "galaxy",
    startTime: "2025-12-10T18:30:00Z",
    format: "IMAX",
    basePrice: 11.5,
    heldSeats: ["B3", "B4", "D6"],
    soldSeats: ["A1", "A2", "C5"],
  },
  {
    id: "st2",
    movieId: "solstice",
    cinemaId: "galaxy",
    startTime: "2025-12-10T20:10:00Z",
    format: "4DX",
    basePrice: 10.2,
    heldSeats: ["C4", "C5"],
    soldSeats: ["A5", "A6", "D1"],
  },
  {
    id: "st3",
    movieId: "harbor",
    cinemaId: "aurora",
    startTime: "2025-12-11T19:15:00Z",
    format: "2D",
    basePrice: 8.4,
    heldSeats: ["B2", "B3"],
    soldSeats: ["C2", "C3", "D4"],
  },
  {
    id: "st4",
    movieId: "echo",
    cinemaId: "skyline",
    startTime: "2025-12-11T21:00:00Z",
    format: "IMAX",
    basePrice: 11.5,
    heldSeats: ["A7"],
    soldSeats: ["B1", "B2", "B3"],
  },
];

const seatLayout = [
  { row: "A", seats: 8 },
  { row: "B", seats: 8 },
  { row: "C", seats: 8 },
  { row: "D", seats: 8 },
];

const formatMultiplier: Record<Movie["format"], number> = {
  "2D": 1,
  "3D": 1.15,
  IMAX: 1.35,
  "4DX": 1.25,
};

export default function BookingPage() {
  const [selectedMovie, setSelectedMovie] = useState<Movie["id"]>(movies[0].id);
  const [selectedCinema, setSelectedCinema] = useState<Cinema["id"]>(cinemas[0].id);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime["id"] | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isPaying, setIsPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const filteredShowtimes = useMemo(
    () =>
      showtimes.filter(
        (st) => st.movieId === selectedMovie && st.cinemaId === selectedCinema,
      ),
    [selectedCinema, selectedMovie],
  );

  useEffect(() => {
    if (filteredShowtimes.length === 0) {
      setSelectedShowtime(null);
      setSelectedSeats([]);
      return;
    }
    if (!filteredShowtimes.find((st) => st.id === selectedShowtime)) {
      setSelectedShowtime(filteredShowtimes[0].id);
      setSelectedSeats([]);
    }
  }, [filteredShowtimes, selectedShowtime]);

  const currentShowtime = showtimes.find((st) => st.id === selectedShowtime) ?? null;
  const currentMovie = movies.find((m) => m.id === selectedMovie)!;
  const currentCinema = cinemas.find((c) => c.id === selectedCinema)!;

  const basePrice = currentShowtime?.basePrice ?? 0;
  const multiplier = currentShowtime ? formatMultiplier[currentShowtime.format] : 1;
  const total = selectedSeats.length * basePrice * multiplier;

  const toggleSeat = (seat: string) => {
    if (!currentShowtime) return;
    const isHeld = currentShowtime.heldSeats.includes(seat);
    const isSold = currentShowtime.soldSeats.includes(seat);
    if (isHeld || isSold) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat],
    );
  };

  const proceedToPayment = () => {
    setStep(5);
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaid(true);
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-[#050916] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,#312e81,transparent_28%),radial-gradient(circle_at_80%_0%,#0ea5e9,transparent_25%),radial-gradient(circle_at_70%_70%,#8b5cf6,transparent_22%)] opacity-40 blur-[120px]" />

      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#050916]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/30 p-2 text-indigo-100 ring-1 ring-indigo-400/40">
              <Film className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-indigo-100/80">Group6</p>
              <p className="text-lg font-semibold">Booking-Movie-Ticket</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-slate-200 md:flex">
            <Link href="/movies" className="hover:text-white">
              Movies
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
            <Link
              href="/auth/login"
              className="rounded-full border border-white/10 px-4 py-2 font-semibold hover:border-white/30"
            >
              Login / Register
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        <section className="grid gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-900/30 via-slate-900/60 to-slate-950 p-8 ring-1 ring-white/10 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-indigo-100">
              <Sparkles className="h-4 w-4" />
              Instant booking
            </span>
            <h1 className="text-4xl font-black leading-tight md:text-5xl">
              Pick the movie, lock your seats, scan the QR. Done.
            </h1>
            <p className="text-lg text-slate-200/90">
              Real-time seat state (available / held / sold), dynamic pricing by format, and a
              mock QR payment for a full booking demo.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-200/90">
              <span className="rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/10">
                JWT-ready flow
              </span>
              <span className="rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/10">
                React Query / Zustand friendly
              </span>
              <span className="rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/10">
                Seat hold logic stubbed
              </span>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 ring-1 ring-white/10">
            <img
              src={currentMovie.poster}
              alt={currentMovie.title}
              className="h-64 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{currentMovie.title}</p>
                <p className="text-xs text-slate-200/80">{currentMovie.genre}</p>
              </div>
              <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-200">
                <Star className="h-4 w-4" />
                {currentMovie.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-100">
              <Ticket className="h-4 w-4" />
              Booking steps
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {[1, 2, 3, 4, 5].map((idx) => (
                <span
                  key={idx}
                  className={`rounded-full px-3 py-1 font-semibold ${
                    step === idx ? "bg-indigo-500 text-white" : "bg-white/10 text-slate-300"
                  }`}
                >
                  {idx === 1 && "Movie"}
                  {idx === 2 && "Cinema"}
                  {idx === 3 && "Showtime"}
                  {idx === 4 && "Seats"}
                  {idx === 5 && "Payment"}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-slate-300">1. Select movie</p>
              <div className="grid gap-2">
                {movies.map((movie) => (
                  <button
                    key={movie.id}
                    onClick={() => {
                      setSelectedMovie(movie.id);
                      setStep(2);
                    }}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                      movie.id === selectedMovie
                        ? "border-indigo-400/70 bg-indigo-500/20"
                        : "border-white/10 bg-white/5 hover:border-indigo-400/40"
                    }`}
                  >
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold">{movie.title}</p>
                      <p className="text-xs text-slate-400">{movie.genre}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-slate-300">2. Select cinema</p>
              <div className="grid gap-2">
                {cinemas.map((cinema) => (
                  <button
                    key={cinema.id}
                    onClick={() => {
                      setSelectedCinema(cinema.id);
                      setStep(3);
                    }}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left transition ${
                      cinema.id === selectedCinema
                        ? "border-indigo-400/70 bg-indigo-500/20"
                        : "border-white/10 bg-white/5 hover:border-indigo-400/40"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold">{cinema.name}</p>
                      <p className="text-xs text-slate-400">
                        <MapPin className="mr-1 inline h-3 w-3" />
                        {cinema.address}, {cinema.city}
                      </p>
                    </div>
                    <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-slate-300">3. Select showtime</p>
              <div className="grid gap-2">
                {filteredShowtimes.length === 0 && (
                  <p className="text-xs text-slate-400">No showtimes for this combo.</p>
                )}
                {filteredShowtimes.map((st) => {
                  const start = new Date(st.startTime);
                  return (
                    <button
                      key={st.id}
                      onClick={() => {
                        setSelectedShowtime(st.id);
                        setSelectedSeats([]);
                        setStep(4);
                      }}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left transition ${
                        st.id === selectedShowtime
                          ? "border-indigo-400/70 bg-indigo-500/20"
                          : "border-white/10 bg-white/5 hover:border-indigo-400/40"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold">
                          {start.toLocaleDateString()} ·{" "}
                          {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        <p className="text-xs text-slate-400">
                          {st.format} · Base ${st.basePrice.toFixed(2)}
                        </p>
                      </div>
                      <Clock3 className="h-4 w-4 text-indigo-200" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-indigo-100">
                <Armchair className="h-4 w-4" />
                Seat map
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-3 w-4 rounded bg-indigo-500/60 ring-1 ring-indigo-200/60" />
                  Selected
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-3 w-4 rounded bg-white/10 ring-1 ring-white/20" />
                  Free
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-3 w-4 rounded bg-amber-500/50 ring-1 ring-amber-200/60" />
                  Held
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-3 w-4 rounded bg-slate-700 ring-1 ring-slate-500" />
                  Sold
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
              <div className="mb-3 text-center text-xs uppercase tracking-[0.3em] text-slate-400">
                Screen
              </div>
              <div className="mb-6 h-1 rounded-full bg-gradient-to-r from-transparent via-indigo-400/70 to-transparent blur-[2px]" />

              <div className="space-y-3">
                {seatLayout.map((row) => (
                  <div key={row.row} className="flex items-center justify-center gap-2">
                    <span className="w-6 text-right text-xs text-slate-500">{row.row}</span>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                      {Array.from({ length: row.seats }, (_, i) => `${row.row}${i + 1}`).map(
                        (seat) => {
                          const isHeld = currentShowtime?.heldSeats.includes(seat);
                          const isSold = currentShowtime?.soldSeats.includes(seat);
                          const isSelected = selectedSeats.includes(seat);
                          return (
                            <button
                              key={seat}
                              disabled={isHeld || isSold}
                              onClick={() => toggleSeat(seat)}
                              className={`flex h-9 items-center justify-center rounded-lg text-xs font-semibold transition ${
                                isSold
                                  ? "cursor-not-allowed bg-slate-700 text-slate-400 ring-1 ring-slate-500"
                                  : isHeld
                                  ? "cursor-not-allowed bg-amber-500/60 text-white ring-1 ring-amber-200/70"
                                  : isSelected
                                  ? "bg-indigo-500/70 text-white ring-1 ring-indigo-200/70"
                                  : "bg-white/5 text-slate-200 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              {seat}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-indigo-100">
                  <Wallet className="h-4 w-4" />
                  Order summary
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-300/30">
                  Step 4/5
                </span>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-200">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{currentMovie.title}</p>
                    <p className="text-xs text-slate-400">
                      {currentMovie.genre} · {currentMovie.duration}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-100">
                    {currentShowtime?.format ?? "Format"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="h-4 w-4" />
                  {currentCinema.name}, {currentCinema.address}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <CalendarDays className="h-4 w-4" />
                  {currentShowtime
                    ? new Date(currentShowtime.startTime).toLocaleString()
                    : "Pick a showtime"}
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>Seats</span>
                    <span>{selectedSeats.length ? selectedSeats.join(", ") : "None"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Base price</span>
                    <span>${basePrice.toFixed(2)} x {selectedSeats.length || 1}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Format multiplier</span>
                    <span>{multiplier.toFixed(2)}x</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Convenience</span>
                    <span>$1.20</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-semibold text-white pt-2">
                    <span>Total</span>
                    <span>${(total + 1.2).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={proceedToPayment}
                  disabled={!currentShowtime || selectedSeats.length === 0 || isPaying}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-[0_18px_40px_-24px_rgba(99,102,241,0.95)] transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-400"
                >
                  {isPaying ? <Loader2 className="h-4 w-4 animate-spin" /> : <HandCoins className="h-4 w-4" />}
                  {isPaying ? "Processing..." : "Confirm & Pay"}
                </button>
                <p className="text-xs text-slate-500">
                  Payment is mocked (QR). In production integrate with your NestJS `/payments/intent` and `/payments/confirm`.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-900/30 to-slate-950 p-5 ring-1 ring-white/10">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-indigo-100">
                <ShieldCheck className="h-4 w-4" />
                Payment (mock QR)
              </div>
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                <div className="grid h-36 w-36 place-items-center rounded-xl bg-white text-black font-semibold">
                  QR MOCK
                </div>
                {paid ? (
                  <div className="flex items-center gap-2 text-emerald-300 text-sm font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    Payment success — seats locked
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    Scan to simulate pay. In real flow, call backend to confirm and mark seats as sold.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
