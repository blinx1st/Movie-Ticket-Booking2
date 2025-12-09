"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { CalendarDays, CheckCircle2, Clock3, Loader2, MapPin, Star, TicketX, Film } from "lucide-react";
import { sendRequest } from "@/utils/api";

type MovieLite = { id: number; title: string; posterUrl?: string; genre?: string; format?: string };
type CinemaLite = { id: number; name?: string; address?: string };
type ShowtimeLite = { id: number; startTime?: string };

type Booking = {
  id: number;
  bookingDate: string;
  status: string;
  totalAmount: number;
  paymentMethod?: string;
  movie?: MovieLite;
  cinema?: CinemaLite;
  showtime?: ShowtimeLite;
  tickets?: {
    id: number;
    price: number;
    seat: { row: string; number: number };
  }[];
};

export default function UserTicketsPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const userId = useMemo(() => {
    const uid = (session?.user as any)?._id || (session as any)?.user?.id;
    return uid ? String(uid) : undefined;
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await sendRequest<IBackendRes<Booking[]>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/me`,
          method: "GET",
          queryParams: { userId },
        });
        if (Array.isArray(res?.data)) setBookings(res.data);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  // pick booking from query
  useEffect(() => {
    const param = searchParams?.get("bookingId");
    if (param) {
      const num = Number(param);
      if (!Number.isNaN(num)) setSelectedId(num);
    }
  }, [searchParams, bookings.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020d1e] text-white flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const selectedBooking = selectedId
    ? bookings.find((b) => b.id === selectedId) || null
    : null;

  return (
    <div className="min-h-screen bg-[#020d1e] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,#1d4ed8,transparent_28%),radial-gradient(circle_at_80%_0%,#0ea5e9,transparent_25%),radial-gradient(circle_at_70%_70%,#6b21a8,transparent_24%)] opacity-30 blur-[120px]" />

      <header className="border-b border-white/10 bg-[#020d1e]/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-100/80">Group6</p>
            <h1 className="text-2xl font-bold">Tickets purchased</h1>
            <p className="text-sm text-gray-400">Your recent bookings and statuses.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/user/profile"
              className="rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-blue-200 hover:border-white/40"
            >
              ← Back to Profile
            </Link>
            <Link
              href="/booking"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold shadow-[0_12px_32px_-18px_rgba(37,99,235,0.9)] transition hover:bg-blue-500"
            >
              Buy ticket
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
              <TicketX className="h-4 w-4" />
              Bookings
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/user/profile"
                className="text-xs font-semibold text-blue-300 hover:text-white rounded-lg border border-white/10 px-3 py-1"
              >
                ← Back to Profile
              </Link>
              <Link
                href="/user/profile"
                className="text-xs font-semibold text-blue-300 hover:text-white"
              >
                Profile
              </Link>
            </div>
          </div>

          {selectedBooking && (
            <div className="mt-4 rounded-xl border border-blue-500/40 bg-blue-900/20 p-4 text-sm text-blue-50">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 overflow-hidden rounded-lg bg-white/10 ring-1 ring-white/20">
                    {selectedBooking.movie?.posterUrl ? (
                      <img
                        src={selectedBooking.movie.posterUrl}
                        alt={selectedBooking.movie.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-blue-100/70">
                        <Film className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-blue-100/70">
                      Booking #{selectedBooking.id}
                    </p>
                    <h3 className="text-lg font-semibold text-white">
                      {selectedBooking.movie?.title || "Movie"}
                    </h3>
                    <p className="text-xs text-blue-100/80">
                      {selectedBooking.cinema?.name || "Cinema"} •{" "}
                      {selectedBooking.showtime?.startTime
                        ? new Date(selectedBooking.showtime.startTime).toLocaleString()
                        : "Showtime"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-white">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      maximumFractionDigits: 0,
                    }).format(selectedBooking.totalAmount)}
                  </p>
                  <p className="text-xs text-blue-100/80">
                    {selectedBooking.paymentMethod || "Payment"} • {selectedBooking.status}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-blue-50/90">
                {(selectedBooking.tickets || []).map((t) => (
                  <span
                    key={t.id}
                    className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 font-semibold"
                  >
                    Seat {t.seat ? `${t.seat.row}${t.seat.number}` : t.id} —{" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      maximumFractionDigits: 0,
                    }).format(t.price)}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 space-y-3">
            {bookings.length === 0 && (
              <p className="text-sm text-gray-400">Chưa có booking.</p>
            )}
            {bookings.map((bk) => (
              <div
                key={bk.id}
                className="grid gap-3 rounded-xl border border-white/10 bg-slate-900/60 p-4 md:grid-cols-[1.5fr_1fr]"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-white">Booking #{bk.id}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                        bk.status === "Paid"
                          ? "bg-emerald-500/20 text-emerald-100"
                          : bk.status === "Pending"
                          ? "bg-amber-500/20 text-amber-100"
                          : "bg-red-500/20 text-red-100"
                      }`}
                    >
                      {bk.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Booking date: <span className="font-semibold text-gray-200">{new Date(bk.bookingDate).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                    {(bk.tickets || []).map((t) => (
                      <span
                        key={t.id}
                        className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-semibold"
                      >
                        Seat {t.seat ? `${t.seat.row}${t.seat.number}` : t.id}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedId(bk.id)}
                    className="mt-2 inline-flex items-center gap-1 rounded-lg border border-white/15 px-3 py-1 text-xs font-semibold text-blue-200 hover:border-white/40"
                  >
                    Xem chi tiết
                  </button>
                </div>

                <div className="space-y-2 text-sm text-gray-200">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-400" />
                    Tổng: {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0, }).format(Number(bk.totalAmount ?? 0))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-gray-400" />
                    Vé: {(bk.tickets || []).length}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-gray-400" />
                    Thanh toán: {bk.paymentMethod || "N/A"}
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-gray-400" />
                    {bk.status === "Paid" ? "QR ready at cinema" : "Hoàn tất thanh toán tại quầy"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Data is live from `/bookings/me`. Vui lòng đăng nhập để xem dữ liệu của bạn.
          </p>
        </div>
      </main>
    </div>
  );
}
