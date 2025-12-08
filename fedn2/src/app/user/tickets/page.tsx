"use client";

import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock3, MapPin, Star, TicketX } from "lucide-react";
import { mockBookings, resolveMovieTitle } from "@/app/lib/mock-bookings";

export default function UserTicketsPage() {
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
          <Link
            href="/booking"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold shadow-[0_12px_32px_-18px_rgba(37,99,235,0.9)] transition hover:bg-blue-500"
          >
            Buy ticket
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
              <TicketX className="h-4 w-4" />
              Bookings
            </div>
            <Link
              href="/user/profile"
              className="text-xs font-semibold text-blue-300 hover:text-white"
            >
              Profile
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {mockBookings.map((bk) => (
              <div
                key={bk.id}
                className="grid gap-3 rounded-xl border border-white/10 bg-slate-900/60 p-4 md:grid-cols-[1.5fr_1fr]"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-white">{resolveMovieTitle(bk.movieSlug)}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                        bk.status === "PAID"
                          ? "bg-emerald-500/20 text-emerald-100"
                          : bk.status === "PENDING"
                          ? "bg-amber-500/20 text-amber-100"
                          : "bg-red-500/20 text-red-100"
                      }`}
                    >
                      {bk.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Booking ID: <span className="font-semibold text-gray-200">{bk.id}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                    {bk.seats.map((seat) => (
                      <span
                        key={seat}
                        className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-semibold"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {bk.cinema}
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-400" />
                    {bk.createdAt}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-gray-400" />
                    Showtime: {bk.showtime}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-gray-400" />
                    Amount: ${bk.amount.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-gray-400" />
                    {bk.status === "PAID" ? "QR ready at cinema" : "Complete payment at counter"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Mock data only. Connect to `/bookings/me` once your NestJS backend is wired.
          </p>
        </div>
      </main>
    </div>
  );
}
