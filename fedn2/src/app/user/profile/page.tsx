"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { message } from "antd";
import { CheckCircle2, CreditCard, Film, Loader2, Mail, Phone, Ticket, User2 } from "lucide-react";
import { sendRequest } from "@/utils/api";

type Booking = {
  id: number;
  totalAmount: number;
  bookingDate: string;
  status: string;
  paymentMethod?: string;
  tickets?: {
    id: number;
    price: number;
    seat: { row: string; number: number };
    showtimeId: number;
  }[];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

export default function UserProfilePage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const userId = useMemo(() => {
    const uid = (session?.user as any)?._id || (session as any)?.user?.id;
    return uid ? String(uid) : undefined;
  }, [session]);

  const accessToken = useMemo(() => {
    const tokenFromSession = (session?.user as any)?.access_token;
    const tokenRoot = (session as any)?.access_token;
    if (tokenFromSession) return tokenFromSession as string;
    if (tokenRoot) return tokenRoot as string;
    if (typeof window !== "undefined") return localStorage.getItem("token") || undefined;
    return undefined;
  }, [session]);

  // sync session info into profile fields
  useEffect(() => {
    const name = (session?.user as any)?.name || "";
    const email = (session?.user as any)?.email || "";
    const phone = (session?.user as any)?.phone || "";
    setProfile((prev) => ({ ...prev, fullName: name, email, phone }));
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // fetch profile fresh from backend to reflect updates
        const userRes = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}`,
          method: "GET",
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        });
        if (userRes?.data) {
          setProfile({
            fullName: (userRes.data as any)?.full_name || (userRes.data as any)?.name || "",
            email: (userRes.data as any)?.email || "",
            phone: ((userRes.data as any)?.phone ?? "").toString(),
          });
        }
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

  const handleSave = async () => {
    if (!userId) {
      message.error("Please sign in to update profile.");
      return;
    }
    setSaving(true);
    setSaved(false);
    try {
      const payload: any = {
        _id: userId,
        full_name: profile.fullName,
        email: profile.email,
      };
      if (profile.phone?.trim()) {
        payload.phone = profile.phone.trim();
      }

      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
        method: "PATCH",
        body: payload,
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });

      if (+res?.statusCode >= 200 && +res?.statusCode < 300) {
        message.success("Profile updated successfully.");
        setSaved(true);
        // refresh local profile with returned data if available
        if (res?.data) {
          setProfile((prev) => ({
            fullName: (res.data as any)?.full_name ?? prev.fullName,
            email: (res.data as any)?.email ?? prev.email,
            phone: ((res.data as any)?.phone ?? prev.phone)?.toString(),
          }));
        }
      } else if (res?.data || res?.message || res?.statusCode) {
        message.error(res?.message || "Failed to update profile.");
      } else {
        message.error("Failed to update profile.");
      }
    } catch (error: any) {
      message.error(error?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const transactions = bookings.map((b) => ({
    id: b.id,
    item: `Booking #${b.id}`,
    date: new Date(b.bookingDate).toLocaleString(),
    method: b.paymentMethod || "N/A",
    amount: b.totalAmount,
    status: b.status,
  }));

  const ticketsFlat =
    bookings.flatMap((b) =>
      (b.tickets || []).map((t) => ({
        bookingId: b.id,
        status: b.status,
        payment: b.paymentMethod || "N/A",
        total: b.totalAmount,
        seat: t.seat ? `${t.seat.row}${t.seat.number}` : "",
        price: t.price,
      })),
    ) || [];

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#020d1e] text-white flex items-center justify-center">
        <div className="space-y-4 text-center">
          <p className="text-lg text-gray-200">Please sign in to view your profile.</p>
          <Link href="/auth/login" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-[#020d1e] text-white flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

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
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold hover:border-white/40"
            >
              ← Home
            </Link>
            <Link
              href="/user/tickets"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold hover:border-white/40"
            >
              View tickets
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-8 px-6 py-10">
        <div className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
            <User2 className="h-4 w-4" />
            Thông tin chung
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
              Lịch sử giao dịch
            </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-gray-400">
              {transactions.length} records
            </span>
          </div>

          <div className="divide-y divide-white/5">
            {transactions.length === 0 && (
              <p className="py-4 text-sm text-gray-400">Chưa có giao dịch.</p>
            )}
            {transactions.map((tx) => {
              const statusClass =
                tx.status === "Paid"
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
                      <p className="text-[11px] text-gray-500">Mã giao dịch: {tx.id}</p>
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
            Vé đã mua
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {ticketsFlat.length === 0 && (
              <p className="text-sm text-gray-400">Chưa có vé.</p>
            )}
            {ticketsFlat.map((ticket, idx) => {
              const statusClass =
                ticket.status === "Paid"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                  : ticket.status === "Pending"
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
                  : "border-rose-500/40 bg-rose-500/10 text-rose-100";

              return (
                <div
                  key={`${ticket.bookingId}-${idx}`}
                  className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-5 ring-1 ring-white/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-600/20 p-3 text-blue-100 ring-1 ring-blue-500/30">
                        <Film className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-blue-100/80">
                          Booking #{ticket.bookingId}
                        </p>
                        <h3 className="text-lg font-semibold leading-tight text-white">Seat {ticket.seat}</h3>
                        <p className="text-xs text-gray-400">Price: {formatCurrency(ticket.price)}</p>
                      </div>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${statusClass}`}>
                      {ticket.status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-sm">
                    <div className="text-gray-200">
                      <p className="text-base font-semibold text-white">{formatCurrency(ticket.total)}</p>
                      <p className="text-xs text-gray-400">Payment: {ticket.payment}</p>
                    </div>
                    <Link
                      href={`/user/tickets?bookingId=${ticket.bookingId}`}
                      className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-blue-100 transition hover:border-white/40"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
