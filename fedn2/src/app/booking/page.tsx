"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
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
  Building2,
} from "lucide-react";
import { message } from "antd";
import { sendRequest } from "@/utils/api";

type Movie = {
  id: number;
  title: string;
  slug: string;
  genre: string;
  durationMinutes: number;
  rating: number;
  posterUrl: string;
  format: string;
};

type Cinema = {
  id: number;
  name: string;
  address?: string;
  city?: string;
};

type Showtime = {
  id: number;
  movieId: number;
  cinemaId: number;
  startTime: string;
  price: number;
  times?: string[];
};

type SeatStatus = {
  id: number;
  row: string;
  number: number;
  type: string;
  isBooked?: boolean;
};

const formatMultiplier: Record<string, number> = {
  "2D": 1,
  "3D": 1.15,
  IMAX: 1.35,
  "4DX": 1.25,
};

export default function BookingPage() {
  const { data: session } = useSession();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [seats, setSeats] = useState<SeatStatus[]>([]);

  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [selectedCinema, setSelectedCinema] = useState<number | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<number | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const userId = useMemo(() => {
    const uid = (session?.user as any)?._id || (session as any)?.user?.id;
    return uid ? String(uid) : undefined;
  }, [session]);

  // Fetch base data
  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      try {
        const [moviesRes, cinemasRes] = await Promise.all([
          sendRequest<IBackendRes<Movie[]>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies`,
            method: "GET",
            queryParams: { status: "Now Showing" },
          }),
          sendRequest<IBackendRes<Cinema[]>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cinemas`,
            method: "GET",
          }),
        ]);
        if (Array.isArray(moviesRes?.data)) setMovies(moviesRes.data);
        if (Array.isArray(cinemasRes?.data)) setCinemas(cinemasRes.data);
        if (moviesRes?.data?.[0]) setSelectedMovie(moviesRes.data[0].id);
        if (cinemasRes?.data?.[0]) setSelectedCinema(cinemasRes.data[0].id);
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, []);

  // Fetch showtimes when movie/cinema changes
  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!selectedMovie || !selectedCinema) return;
      try {
        const res = await sendRequest<IBackendRes<Showtime[]>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/showtimes`,
          method: "GET",
          queryParams: { movieId: selectedMovie, cinemaId: selectedCinema },
        });
        let list: Showtime[] = Array.isArray(res?.data) ? res.data : [];
        if (list.length === 0) {
          const resMovieOnly = await sendRequest<IBackendRes<Showtime[]>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/showtimes`,
            method: "GET",
            queryParams: { movieId: selectedMovie },
          });
          if (Array.isArray(resMovieOnly?.data)) list = resMovieOnly.data;
        }
        setShowtimes(list);
        if (!list.find((st) => st.id === selectedShowtime)) {
          setSelectedShowtime(list[0]?.id ?? null);
          setSelectedSeats([]);
        }
      } catch {
        setShowtimes([]);
        setSelectedShowtime(null);
        setSelectedSeats([]);
      }
    };
    fetchShowtimes();
  }, [selectedMovie, selectedCinema]);

  // Fetch seats when showtime changes
  useEffect(() => {
    const fetchSeats = async () => {
      if (!selectedShowtime) {
        setSeats([]);
        return;
      }
      try {
        const res = await sendRequest<IBackendRes<SeatStatus[]>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/seats/status`,
          method: "GET",
          queryParams: { showtimeId: selectedShowtime },
        });
        if (Array.isArray(res?.data)) {
          setSeats(res.data);
        } else {
          setSeats([]);
        }
      } catch {
        setSeats([]);
      }
    };
    fetchSeats();
  }, [selectedShowtime]);

  const currentShowtime = showtimes.find((st) => st.id === selectedShowtime) ?? null;
  const currentMovie = movies.find((m) => m.id === selectedMovie);
  const currentCinema = cinemas.find((c) => c.id === selectedCinema);

  const basePrice = Number(currentShowtime?.price ?? 0);
  const multiplier = currentMovie ? formatMultiplier[currentMovie.format] ?? 1 : 1;
  const total = selectedSeats.length * basePrice * multiplier;

  const toggleSeat = (seatId: number) => {
    const seat = seats.find((s) => s.id === seatId);
    if (!seat) return;
    if (seat.isBooked) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId],
    );
  };

  const proceedToPayment = async () => {
    if (!currentShowtime || !currentMovie) return;
    if (selectedSeats.length === 0) {
      message.warning("Please select seats");
      return;
    }
    if (!userId) {
      message.warning("Please sign in to complete payment");
      return;
    }
    setIsPaying(true);
    try {
      await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/checkout`,
        method: "POST",
        body: {
          userId,
          showtimeId: currentShowtime.id,
          movieId: currentMovie.id,
          seatIds: selectedSeats,
          paymentMethod: "Mock",
        },
      });
      message.success("Payment success & seats booked");
      setPaid(true);
      // Mark local seats as booked immediately
      setSeats((prev) =>
        prev.map((s) =>
          selectedSeats.includes(s.id) ? { ...s, isBooked: true } : s,
        ),
      );
      setSelectedSeats([]);
      // refresh seats status from server
      const res = await sendRequest<IBackendRes<SeatStatus[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/seats/status`,
        method: "GET",
        queryParams: { showtimeId: currentShowtime.id },
      });
      if (Array.isArray(res?.data)) setSeats(res.data);
    } catch (err: any) {
      message.error(err?.message || "Booking failed");
    } finally {
      setIsPaying(false);
    }
  };

  const seatLabel = (seat: SeatStatus) => `${seat.row}${seat.number}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050916] text-white flex items-center justify-center">
        <p className="text-lg text-slate-200">Loading...</p>
      </div>
    );
  }

  if (!currentMovie || !currentCinema) {
    return (
      <div className="min-h-screen bg-[#050916] text-white flex items-center justify-center">
        <p className="text-lg text-slate-200">Please add movies and cinemas first.</p>
      </div>
    );
  }

  const filteredShowtimes = showtimes.filter((st) => {
    if (!st.movieId || st.movieId !== currentMovie.id) return false;
    if (st.cinemaId && currentCinema.id) return st.cinemaId === currentCinema.id;
    return true; // nếu showtime chưa có cinemaId (dữ liệu cũ) vẫn hiển thị
  });

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
              Real-time seat state, dynamic pricing by format, and a mock payment for a full booking demo.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-200/90">
              <span className="rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/10">
                JWT-ready flow
              </span>
              <span className="rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/10">
                API driven
              </span>
              <span className="rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/10">
                Seat lock logic simplified
              </span>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 ring-1 ring-white/10">
            <img
              src={currentMovie.posterUrl}
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
                {(currentMovie.rating ?? 0).toFixed(1)}
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
              {["Movie", "Cinema", "Showtime", "Seats", "Payment"].map((label, idx) => (
                <span
                  key={label}
                  className={`rounded-full px-3 py-1 font-semibold ${
                    idx + 1 === (selectedShowtime ? (selectedSeats.length > 0 ? 4 : 3) : 2)
                      ? "bg-indigo-500 text-white"
                      : "bg-white/10 text-slate-300"
                  }`}
                >
                  {label}
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
                      setSelectedShowtime(null);
                      setSelectedSeats([]);
                    }}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                      movie.id === selectedMovie
                        ? "border-indigo-400/70 bg-indigo-500/20"
                        : "border-white/10 bg-white/5 hover:border-indigo-400/40"
                    }`}
                  >
                    <img
                      src={movie.posterUrl}
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
                      setSelectedShowtime(null);
                      setSelectedSeats([]);
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
                        setPaid(false);
                      }}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left transition ${
                        st.id === selectedShowtime
                          ? "border-indigo-400/70 bg-indigo-500/20"
                          : "border-white/10 bg-white/5 hover:border-indigo-400/40"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold">
                          {start.toLocaleDateString()} •{" "}
                          {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        <p className="text-xs text-slate-400">
                          Base {Number(st?.price ?? 0).toFixed(0)} VND
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
                {[...new Set(seats.map((s) => s.row))].map((row) => {
                  const rowSeats = seats
                    .filter((s) => s.row === row)
                    .sort((a, b) => a.number - b.number);
                  return (
                    <div key={row} className="flex items-center justify-center gap-2">
                      <span className="w-6 text-right text-xs text-slate-500">{row}</span>
                      <div className="grid grid-cols-8 gap-2">
                        {rowSeats.map((seat) => {
                          const isSold = !!seat.isBooked;
                          const isSelected = selectedSeats.includes(seat.id);
                          return (
                            <button
                              key={seat.id}
                              disabled={isSold}
                              onClick={() => toggleSeat(seat.id)}
                              className={`flex h-9 items-center justify-center rounded-lg text-xs font-semibold transition ${
                                isSold
                                  ? "cursor-not-allowed bg-slate-700 text-slate-400 ring-1 ring-slate-500"
                                  : isSelected
                                  ? "bg-indigo-500/70 text-white ring-1 ring-indigo-200/70"
                                  : "bg-white/5 text-slate-200 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              {seatLabel(seat)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
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
                      {currentMovie.genre} • {currentMovie.durationMinutes}m
                    </p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-100">
                    {currentMovie.format}
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
                    <span>
                      {selectedSeats.length
                        ? selectedSeats
                            .map((id) => seats.find((s) => s.id === id))
                            .filter(Boolean)
                            .map((s) => seatLabel(s as SeatStatus))
                            .join(", ")
                        : "None"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Base price</span>
                    <span>{basePrice.toFixed(0)} VND x {selectedSeats.length || 1}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Format multiplier</span>
                    <span>{multiplier.toFixed(2)}x</span>
                  </div>
                  <div className="flex items-center justify-between">
                  </div>
                  <div className="flex items-center justify-between text-base font-semibold text-white pt-2">
                    <span>Total</span>
                    <span>{(total).toFixed(0)} VND</span>
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
                  Payment is mocked. In production integrate with backend payments and seat holds.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-900/30 to-slate-950 p-5 ring-1 ring-white/10">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-indigo-100">
                <ShieldCheck className="h-4 w-4" />
                Payment (mock)
              </div>
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                <div className="grid h-36 w-36 place-items-center rounded-xl bg-white text-black font-semibold">
                  QR MOCK
                </div>
                {paid ? (
                  <div className="flex items-center gap-2 text-emerald-300 text-sm font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    Payment success • seats locked
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
