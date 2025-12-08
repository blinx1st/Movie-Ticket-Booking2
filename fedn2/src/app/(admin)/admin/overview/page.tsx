"use client";

import Link from "next/link";
import { CalendarDays, Film, Ticket, Users } from "lucide-react";
import { movieDetails } from "@/app/movies/data";
import { mockBookings, resolveMovieTitle } from "@/app/lib/mock-bookings";

const mockUsers = [
  { id: 1, name: "Jane Doe", email: "jane@example.com", role: "USER", status: "ACTIVE" },
  { id: 2, name: "Admin One", email: "admin@example.com", role: "ADMIN", status: "ACTIVE" },
  { id: 3, name: "User Two", email: "user2@example.com", role: "USER", status: "ACTIVE" },
];

export default function AdminOverviewPage() {
  return (
    <div className="min-h-screen bg-[#020d1e] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,#1d4ed8,transparent_28%),radial-gradient(circle_at_80%_0%,#0ea5e9,transparent_25%),radial-gradient(circle_at_70%_70%,#6b21a8,transparent_24%)] opacity-30 blur-[120px]" />

      <header className="border-b border-white/10 bg-[#020d1e]/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-100/80">Group6</p>
            <h1 className="text-2xl font-bold">Admin Overview</h1>
            <p className="text-sm text-gray-400">Movies, bookings, and users (mock data).</p>
          </div>
          <Link
            href="/admin/movies"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold shadow-[0_12px_32px_-18px_rgba(37,99,235,0.9)] transition hover:bg-blue-500"
          >
            Manage movies
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Movies", value: movieDetails.length, icon: Film },
            { label: "Bookings", value: mockBookings.length, icon: Ticket },
            { label: "Users", value: mockUsers.length, icon: Users },
            { label: "Showtimes", value: 12, icon: CalendarDays },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/10"
            >
              <div className="rounded-xl bg-blue-600/20 p-3 text-blue-100 ring-1 ring-blue-500/30">
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
                Recent bookings
              </p>
              <Link
                href="/admin/bookings"
                className="text-xs font-semibold text-blue-300 hover:text-white"
              >
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-3 text-sm text-gray-200">
              {mockBookings.map((bk) => (
                <div
                  key={bk.id}
                  className="flex flex-col gap-2 rounded-xl border border-white/10 bg-slate-900/60 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-white">{resolveMovieTitle(bk.movieSlug)}</p>
                    <p className="text-xs text-gray-400">{bk.cinema}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-white/10 px-3 py-1 font-semibold text-gray-100">
                      {bk.showtime}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 font-semibold text-gray-100">
                      ${bk.amount.toFixed(2)}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 font-semibold ${
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
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
                Users
              </p>
              <Link
                href="/admin/users"
                className="text-xs font-semibold text-blue-300 hover:text-white"
              >
                Manage
              </Link>
            </div>
            <div className="mt-4 space-y-3 text-sm text-gray-200">
              {mockUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 p-4"
                >
                  <div>
                    <p className="font-semibold text-white">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-gray-100">
                    {u.role} · {u.status}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-400">
              Replace with `/admin/users` API. This is mock data for layout/demo.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
