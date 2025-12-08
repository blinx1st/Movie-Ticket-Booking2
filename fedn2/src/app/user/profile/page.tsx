"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, CreditCard, Film, Loader2, Mail, Phone, Ticket, User2 } from "lucide-react";

const mockProfile = {
  fullName: "Jane Doe",
  email: "jane@example.com",
  phone: "+84 912 345 678",
};

const mockTransactions = [
  {
    id: "TXN-2033",
    item: "Dune: Part Two",
    date: "10/03/2024 - 19:30",
    method: "Momo Wallet",
    amount: 260000,
    status: "Completed",
  },
  {
    id: "TXN-2032",
    item: "Kung Fu Panda 4",
    date: "01/03/2024 - 14:10",
    method: "Visa ** 3048",
    amount: 180000,
    status: "Completed",
  },
  {
    id: "TXN-2031",
    item: "Snack combo (Popcorn + Cola)",
    date: "27/02/2024 - 20:05",
    method: "Counter payment",
    amount: 95000,
    status: "Pending",
  },
];

const mockTickets = [
  {
    id: "MVS-3882",
    movie: "Dune: Part Two",
    time: "Fri, 15 Mar 2024 - 19:30",
    cinema: "CGV Vincom Landmark",
    seats: ["E7", "E8"],
    room: "Room 5 - IMAX",
    status: "Active",
    payment: "Momo Wallet",
    total: 260000,
    code: "8KD2-P19Q",
  },
  {
    id: "MVS-3859",
    movie: "Kung Fu Panda 4",
    time: "Sun, 03 Mar 2024 - 14:10",
    cinema: "Lotte Cinema Go Vap",
    seats: ["D10"],
    room: "Room 3",
    status: "Used",
    payment: "Visa ** 3048",
    total: 180000,
    code: "6JW2-C3MV",
  },
  {
    id: "MVS-3822",
    movie: "Oppenheimer",
    time: "Sat, 24 Feb 2024 - 21:00",
    cinema: "BHD Bitexco",
    seats: ["B3", "B4"],
    room: "Room 2 - 2D",
    status: "Cancelled",
    payment: "Refunded",
    total: 220000,
    code: "4MD8-J2KQ",
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

export default function UserProfilePage() {
  const [profile, setProfile] = useState(mockProfile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#020d1e] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,#1d4ed8,transparent_28%),radial-gradient(circle_at_80%_0%,#0ea5e9,transparent_25%),radial-gradient(circle_at_70%_70%,#6b21a8,transparent_24%)] opacity-30 blur-[120px]" />

      <header className="border-b border-white/10 bg-[#020d1e]/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-100/80">Group6</p>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-sm text-gray-400">Manage your account details.</p>
          </div>
          <Link
            href="/user/tickets"
            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold hover:border-white/40"
          >
            View tickets
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-8 px-6 py-10">
        <div className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
            <User2 className="h-4 w-4" />
            Thong tin chung
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-gray-200">
              <span>Full name</span>
              <input
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none ring-1 ring-transparent transition focus:border-blue-400/70"
              />
            </label>
            <label className="space-y-2 text-sm text-gray-200">
              <span>Email</span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 text-sm text-white outline-none ring-1 ring-transparent transition focus:border-blue-400/70"
                />
              </div>
            </label>
            <label className="space-y-2 text-sm text-gray-200">
              <span>Phone</span>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 text-sm text-white outline-none ring-1 ring-transparent transition focus:border-blue-400/70"
                />
              </div>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold shadow-[0_12px_32px_-18px_rgba(37,99,235,0.9)] transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-gray-400"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {saving ? "Saving..." : "Save changes"}
            </button>
            {saved && <span className="text-sm text-emerald-300">Saved!</span>}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
              <CreditCard className="h-4 w-4" />
              Lich su giao dich
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-gray-400">
              Mock data
            </span>
          </div>

          <div className="divide-y divide-white/5">
            {mockTransactions.map((tx) => {
              const statusClass =
                tx.status === "Completed"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                  : tx.status === "Pending"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
                  : "border-slate-500/30 bg-slate-500/10 text-slate-200";

              return (
                <div
                  key={tx.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600/40 to-purple-600/40 ring-1 ring-white/10">
                      <CreditCard className="h-5 w-5 text-blue-100" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{tx.item}</p>
                      <p className="text-xs text-gray-400">{tx.date} - {tx.method}</p>
                      <p className="text-[11px] text-gray-500">Ma giao dich: {tx.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-semibold text-white">{formatCurrency(tx.amount)}</span>
                    <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${statusClass}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
            <Ticket className="h-4 w-4" />
            Ve da mua
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {mockTickets.map((ticket) => {
              const statusClass =
                ticket.status === "Active"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                  : ticket.status === "Used"
                  ? "border-blue-500/40 bg-blue-500/10 text-blue-100"
                  : "border-rose-500/40 bg-rose-500/10 text-rose-100";

              return (
                <div
                  key={ticket.id}
                  className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-5 ring-1 ring-white/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-600/20 p-3 text-blue-100 ring-1 ring-blue-500/30">
                        <Film className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-blue-100/80">{ticket.id}</p>
                        <h3 className="text-lg font-semibold leading-tight text-white">{ticket.movie}</h3>
                        <p className="text-xs text-gray-400">{ticket.cinema}</p>
                      </div>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${statusClass}`}>
                      {ticket.status}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-gray-200 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-blue-200" />
                      <span>{ticket.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-blue-200" />
                      <span>Ghe: {ticket.seats.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-blue-200" />
                      <span>{ticket.payment}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-200" />
                      <span>Ma check-in: {ticket.code}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-sm">
                    <div className="text-gray-200">
                      <p className="text-base font-semibold text-white">{formatCurrency(ticket.total)}</p>
                      <p className="text-xs text-gray-400">{ticket.room}</p>
                    </div>
                    <button className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-blue-100 transition hover:border-white/40">
                      Xem chi tiet
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10">
          <p className="text-sm text-gray-300">
            This page uses mock data. Connect it to your auth/profile API (NestJS) and add an auth guard to redirect
            to /auth/login when not authenticated.
          </p>
        </div>
      </main>
    </div>
  );
}