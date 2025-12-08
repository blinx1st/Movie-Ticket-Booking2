"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
// Đảm bảo cài icon: npm install lucide-react
import { Film, Monitor, Calendar, Users, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  // 1. Biến lưu số lượng
  const [movieCount, setMovieCount] = useState(0);
  const [screenCount, setScreenCount] = useState(0);
  const [showtimeCount, setShowtimeCount] = useState(0);
  // Giả lập booking count (hoặc bạn có thể lấy từ localStorage nếu muốn)
  const [bookingCount, setBookingCount] = useState(5); 

  useEffect(() => {
    // --- ĐẾM PHIM ---
    const savedMovies = localStorage.getItem("adminMovies");
    if (savedMovies) setMovieCount(JSON.parse(savedMovies).length);
    else setMovieCount(2);

    // --- ĐẾM PHÒNG ---
    const savedScreens = localStorage.getItem("adminScreens");
    if (savedScreens) setScreenCount(JSON.parse(savedScreens).length);
    else setScreenCount(3);

    // --- ĐẾM LỊCH CHIẾU ---
    const savedShowtimes = localStorage.getItem("adminShowtimes");
    if (savedShowtimes) setShowtimeCount(JSON.parse(savedShowtimes).length);
    else setShowtimeCount(2);
  }, []);

  const stats = [
    {
      title: "Movies",
      value: movieCount.toString(),
      color: "bg-blue-600",
      icon: Film,
      link: "/admin/movies",
    },
    {
      title: "Screens",
      value: screenCount.toString(),
      color: "bg-green-600",
      icon: Monitor,
      link: "/admin/screens",
    },
    {
      title: "Showtimes",
      value: showtimeCount.toString(),
      color: "bg-cyan-500",
      icon: Calendar,
      link: "/admin/showtimes",
    },
    {
      title: "Bookings", 
      value: bookingCount.toString(),
      color: "bg-yellow-500",
      icon: Users,
      link: "/admin/bookings",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">System Overview</h2>
        <nav className="flex text-sm text-gray-500 mt-1">
          <span>Home</span> <span className="mx-2">/</span> <span className="text-blue-600 font-medium">Dashboard</span>
        </nav>
      </div>

      {/* 4 Cards Thống kê */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-xl p-6 text-white shadow-lg transition-transform hover:-translate-y-1 ${stat.color}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">{stat.title}</p>
                <h3 className="text-4xl font-bold">{stat.value}</h3>
              </div>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <Link href={stat.link} className="mt-8 flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-80 hover:opacity-100 transition-opacity">
              View Details <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ))}
      </div>

      {/* Biểu đồ Activity Summary */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Activity Summary</h3>
          <div className="flex gap-2">
            <button className="rounded px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">Weekly</button>
            <button className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white shadow">Monthly</button>
          </div>
        </div>

        {/* CSS Chart giả lập */}
        <div className="relative h-[300px] w-full border-l border-b border-gray-200 dark:border-gray-700 px-4 pb-2 flex items-end justify-between gap-2">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                 <div className="border-t border-gray-500 w-full h-0"></div>
                 <div className="border-t border-gray-500 w-full h-0"></div>
                 <div className="border-t border-gray-500 w-full h-0"></div>
                 <div className="border-t border-gray-500 w-full h-0"></div>
                 <div className="border-t border-gray-500 w-full h-0"></div>
            </div>

            {[30, 45, 25, 60, 40, 75, 50, 80, 55, 70, 45, 90].map((h, i) => (
                <div key={i} className="relative w-full h-full flex items-end justify-center group">
                    <div style={{height: `${h}%`}} className="w-2 md:w-3 bg-green-500 rounded-t opacity-80 group-hover:opacity-100 transition-all duration-300 mx-0.5"></div>
                    <div style={{height: `${h * 0.6}%`}} className="w-2 md:w-3 bg-blue-500 rounded-t opacity-80 group-hover:opacity-100 transition-all duration-300 mx-0.5"></div>
                </div>
            ))}
        </div>

        <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-sm"></span>
                <span className="text-sm text-gray-500">Tickets Sold</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-sm"></span>
                <span className="text-sm text-gray-500">Revenue ($)</span>
            </div>
        </div>
      </div>
    </div>
  );
}