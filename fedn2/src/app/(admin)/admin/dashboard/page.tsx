"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Film, Monitor, Calendar, Users, ArrowRight } from "lucide-react";
import { sendRequest } from "@/utils/api";

export default function DashboardPage() {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    const t = (session?.user as any)?.access_token || (session as any)?.access_token;
    if (t) return t as string;
    if (typeof window !== "undefined") return localStorage.getItem("token") || undefined;
    return undefined;
  }, [session]);

  const [movieCount, setMovieCount] = useState<number | null>(null);
  const [screenCount, setScreenCount] = useState<number | null>(null);
  const [showtimeCount, setShowtimeCount] = useState<number | null>(null);
  const [bookingCount, setBookingCount] = useState<number | null>(null);

  useEffect(() => {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    const fetchCounts = async () => {
      try {
        const [moviesRes, cinemasRes, screensRes, showtimesRes, revenueRes] = await Promise.all([
          sendRequest<any>({ url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies`, method: "GET", headers }),
          sendRequest<any>({ url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cinemas`, method: "GET", headers }),
          sendRequest<any>({ url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cinema-rooms`, method: "GET", headers }),
          sendRequest<any>({ url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/showtimes`, method: "GET", headers }),
          sendRequest<any>({ url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/revenue/summary`, method: "GET", headers }),
        ]);
        setMovieCount(Array.isArray(moviesRes?.data) ? moviesRes.data.length : 0);
        // Cinemas vs Screens: use rooms as Screens count as per sidebar
        setScreenCount(Array.isArray(screensRes?.data) ? screensRes.data.length : 0);
        setShowtimeCount(Array.isArray(showtimesRes) ? showtimesRes.length : Array.isArray(showtimesRes?.data) ? showtimesRes.data.length : 0);
        const totalTx = revenueRes?.totalCount ?? 0;
        setBookingCount(Number(totalTx) || 0);
      } catch {
        setMovieCount(0);
        setScreenCount(0);
        setShowtimeCount(0);
        setBookingCount(0);
      }
    };
    fetchCounts();
  }, [accessToken]);

  const stats = [
    { title: "Movies", value: movieCount ?? 0, color: "bg-blue-600", icon: Film, link: "/admin/movies" },
    { title: "Screens", value: screenCount ?? 0, color: "bg-green-600", icon: Monitor, link: "/admin/screens" },
    { title: "Showtimes", value: showtimeCount ?? 0, color: "bg-cyan-500", icon: Calendar, link: "/admin/showtimes" },
    { title: "Bookings", value: bookingCount ?? 0, color: "bg-yellow-500", icon: Users, link: "/admin/bookings" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">System Overview</h2>
        <nav className="mt-1 flex text-sm text-gray-500">
          <span>Home</span> <span className="mx-2">/</span> <span className="text-blue-600 font-medium">Dashboard</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-xl p-6 text-white shadow-lg transition-transform hover:-translate-y-1 ${stat.color}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-1 text-sm font-medium opacity-90">{stat.title}</p>
                <h3 className="text-4xl font-bold">{stat.value}</h3>
              </div>
              <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
            </div>

            <Link
              href={stat.link}
              className="mt-8 flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-80 transition-opacity hover:opacity-100"
            >
              View Details <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ))}
      </div>

      <ActivitySummary accessToken={accessToken} />
    </div>
  );
}

function ActivitySummary({ accessToken }: { accessToken?: string }) {
  const [summary, setSummary] = useState<{ totalRevenue: number; totalCount: number }>({
    totalRevenue: 0,
    totalCount: 0,
  });
  const [daily, setDaily] = useState<{ label: string; revenue: number; count: number }[]>([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/revenue/summary`,
          method: "GET",
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        });
        const payload = res?.data || res;
        setSummary({
          totalRevenue: Number(payload?.totalRevenue || 0),
          totalCount: Number(payload?.totalCount || 0),
        });
      } catch {
        setSummary({ totalRevenue: 0, totalCount: 0 });
      }
    };

    const fetchDaily = async () => {
      try {
        const txRes = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/revenue/transactions`,
          method: "GET",
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        });
        const list = Array.isArray(txRes?.data) ? txRes.data : Array.isArray(txRes) ? txRes : [];
        const map = new Map<string, { revenue: number; count: number }>();
        list.forEach((tx: any) => {
          const d = tx.bookingDate ? new Date(tx.bookingDate) : new Date();
          const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
          const revenue = Number(tx.totalAmount || 0);
          const prev = map.get(key) || { revenue: 0, count: 0 };
          map.set(key, { revenue: prev.revenue + revenue, count: prev.count + 1 });
        });
        const days: { label: string; revenue: number; count: number }[] = [];
        for (let i = 13; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = d.toISOString().slice(0, 10);
          const display = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`;
          const val = map.get(key) || { revenue: 0, count: 0 };
          days.push({ label: display, revenue: val.revenue, count: val.count });
        }
        setDaily(days);
      } catch {
        setDaily([]);
      }
    };

    fetchSummary();
    fetchDaily();
  }, [accessToken]);

  const data =
    daily.length > 0
      ? daily
      : [
          { label: "01/01", revenue: 0, count: 0 },
          { label: "02/01", revenue: 0, count: 0 },
          { label: "03/01", revenue: 0, count: 0 },
          { label: "04/01", revenue: 0, count: 0 },
          { label: "05/01", revenue: 0, count: 0 },
          { label: "06/01", revenue: 0, count: 0 },
          { label: "07/01", revenue: 0, count: 0 },
          { label: "08/01", revenue: 0, count: 0 },
        ];

  const totalsTickets = summary.totalCount;
  const totalsRevenue = summary.totalRevenue;
  const formatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

  const maxRevenue = Math.max(...data.map((d) => d.revenue || 0), 1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Activity Summary</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Revenue per day (last 14 days) & totals from Revenue</p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-lg border border-blue-200/40 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100">
            Tickets total: {totalsTickets}
          </div>
          <div className="rounded-lg border border-emerald-200/40 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100">
            Revenue total: {formatter.format(totalsRevenue)}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white/40 p-4 dark:border-gray-700 dark:bg-gray-900/40">
        <div className="relative h-[320px] w-full">
          <div className="absolute inset-0 flex flex-col justify-between opacity-30">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-t border-gray-200 dark:border-gray-700" />
            ))}
          </div>
          <div className="relative flex h-full items-end gap-3 px-2 pb-6">
            {data.map((d) => {
              const revenueHeight = ((d.revenue || 0) / maxRevenue) * 100;
              return (
                <div key={d.label} className="group relative flex w-full flex-col items-center gap-2">
                  <div className="flex w-full items-end gap-1">
                    <div
                      className="w-4 md:w-5 rounded-sm bg-blue-500 shadow-lg transition-all duration-200 group-hover:bg-blue-400"
                      style={{ height: `${revenueHeight}%` }}
                      title={`Revenue: ${formatter.format(d.revenue)} | Transactions: ${d.count}`}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{d.label}</span>
                  <span className="text-[10px] text-gray-400 group-hover:text-gray-200">{formatter.format(d.revenue)}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-blue-500" />
            Revenue per day
          </div>
        </div>
      </div>
    </div>
  );
}


