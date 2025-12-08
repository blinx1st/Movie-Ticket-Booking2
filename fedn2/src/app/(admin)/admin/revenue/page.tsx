"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Wallet, Calendar, Clock, TrendingUp, ArrowRight } from "lucide-react";

export default function RevenuePage() {
  // State dữ liệu gốc
  const [allBookings, setAllBookings] = useState<any[]>([]);
  
  // State hiển thị
  const [activeTab, setActiveTab] = useState("total"); // 'total' | 'monthly' | 'weekly' | 'today'
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  
  // State thống kê con số
  const [stats, setStats] = useState({
    total: { amount: 0, count: 0 },
    monthly: { amount: 0, count: 0 },
    weekly: { amount: 0, count: 0 },
    today: { amount: 0, count: 0 },
  });

  useEffect(() => {
    // 1. Lấy dữ liệu từ LocalStorage
    const savedBookings = localStorage.getItem("adminBookings");
    
    // Dữ liệu mẫu phong phú để test
    const mockBookings = [
      { id: "BK-001", movie: "Stranger Things", amount: 120000, date: new Date().toISOString(), status: "Completed", user: "user1@test.com" },
      { id: "BK-002", movie: "The Conjuring", amount: 150000, date: new Date().toISOString(), status: "Completed", user: "guest@test.com" },
      { id: "BK-003", movie: "Stranger Things", amount: 240000, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: "Completed", user: "vip@test.com" }, // 2 ngày trước
      { id: "BK-004", movie: "How to Train Your Dragon", amount: 100000, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: "Completed", user: "kid@test.com" }, // 5 ngày trước
      { id: "BK-005", movie: "HI FIVE", amount: 120000, date: "2025-05-20", status: "Completed", user: "old@test.com" }, // Tháng trước
    ];

    const bookings = savedBookings ? JSON.parse(savedBookings) : mockBookings;
    setAllBookings(bookings);
    calculateStats(bookings);
  }, []);

  // 2. Lọc danh sách giao dịch mỗi khi đổi Tab hoặc dữ liệu thay đổi
  useEffect(() => {
    filterTransactions(activeTab, allBookings);
  }, [activeTab, allBookings]);

  // Hàm tính toán các con số trên thẻ
  const calculateStats = (bookings: any[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const todayStr = now.toISOString().split('T')[0];

    let newStats = {
      total: { amount: 0, count: 0 },
      monthly: { amount: 0, count: 0 },
      weekly: { amount: 0, count: 0 },
      today: { amount: 0, count: 0 },
    };

    bookings.forEach((booking: any) => {
      if (booking.status === "Cancelled") return;
      const amount = Number(booking.amount) || 0;
      const bDate = new Date(booking.date || booking.bookingDate || new Date());
      
      // Total
      newStats.total.amount += amount;
      newStats.total.count += 1;

      // Monthly
      if (bDate.getMonth() === currentMonth && bDate.getFullYear() === currentYear) {
        newStats.monthly.amount += amount;
        newStats.monthly.count += 1;
      }

      // Today
      if (bDate.toISOString().split('T')[0] === todayStr) {
        newStats.today.amount += amount;
        newStats.today.count += 1;
      }

      // Weekly (7 ngày gần nhất)
      const diffTime = Math.abs(now.getTime() - bDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if (diffDays <= 7) {
        newStats.weekly.amount += amount;
        newStats.weekly.count += 1;
      }
    });
    setStats(newStats);
  };

  // Hàm lọc danh sách hiển thị bảng
  const filterTransactions = (tab: string, bookings: any[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const todayStr = now.toISOString().split('T')[0];

    const result = bookings.filter(b => {
        if (b.status === "Cancelled") return false; // Chỉ hiện đơn thành công/pending
        const bDate = new Date(b.date || b.bookingDate || new Date());

        if (tab === 'total') return true;
        if (tab === 'monthly') return bDate.getMonth() === currentMonth && bDate.getFullYear() === currentYear;
        if (tab === 'today') return bDate.toISOString().split('T')[0] === todayStr;
        if (tab === 'weekly') {
            const diffTime = Math.abs(now.getTime() - bDate.getTime());
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) <= 7;
        }
        return false;
    });
    setFilteredTransactions(result);
  };

  const formatVND = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'VNĐ');
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('vi-VN');

  // Component Thẻ Card để tái sử dụng
  const StatCard = ({ id, title, value, count, icon: Icon, color, activeColor }: any) => {
    const isActive = activeTab === id;
    return (
        <div 
            onClick={() => setActiveTab(id)}
            className={`cursor-pointer rounded-xl p-6 text-white shadow-lg relative overflow-hidden transition-all transform duration-300 ${isActive ? 'scale-105 ring-4 ring-offset-2 ring-blue-200' : 'hover:-translate-y-1'} ${color}`}
        >
            <div className="relative z-10">
                <h4 className="mb-2 text-sm font-medium opacity-90">{title}</h4>
                <h3 className="text-2xl font-bold mb-4">{formatVND(value)}</h3>
                <p className="text-xs opacity-90 font-medium bg-white/20 inline-block px-2 py-1 rounded">
                    {count} bookings
                </p>
            </div>
            <div className="absolute right-4 top-4 p-2 bg-white/20 rounded-lg">
                <Icon className="w-6 h-6 text-white" />
            </div>
            {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/50 animate-pulse"></div>
            )}
        </div>
    );
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-black dark:text-white">Revenue Analytics</h2>
        <nav>
          <ol className="flex items-center gap-2 text-sm font-medium">
            <li><Link href="/dashboard" className="hover:text-blue-600">Home / Admin /</Link></li>
            <li className="text-blue-600">Revenue</li>
          </ol>
        </nav>
      </div>

      {/* --- 4 THẺ TƯƠNG TÁC --- */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard id="total" title="Total Revenue" value={stats.total.amount} count={stats.total.count} icon={Wallet} color="bg-blue-600" />
        <StatCard id="monthly" title="Monthly Revenue" value={stats.monthly.amount} count={stats.monthly.count} icon={Calendar} color="bg-green-600" />
        <StatCard id="weekly" title="Weekly Revenue" value={stats.weekly.amount} count={stats.weekly.count} icon={Clock} color="bg-purple-600" />
        <StatCard id="today" title="Today's Revenue" value={stats.today.amount} count={stats.today.count} icon={TrendingUp} color="bg-red-600" />
      </div>

      {/* --- BẢNG CHI TIẾT GIAO DỊCH (Thay đổi theo thẻ chọn) --- */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-gray-700 dark:bg-gray-800 transition-all duration-300">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 border-b border-stroke dark:border-gray-700 flex justify-between items-center">
          <h4 className="text-xl font-bold text-black dark:text-white uppercase flex items-center gap-2">
            {activeTab} Transactions
            <span className="text-sm font-normal normal-case bg-gray-100 text-gray-500 px-3 py-1 rounded-full">{filteredTransactions.length} records</span>
          </h4>
        </div>

        <div className="p-4 md:p-6 xl:p-7.5">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
                <thead>
                <tr className="bg-gray-100 text-left dark:bg-gray-700">
                    <th className="py-4 px-4 font-medium text-gray-500 uppercase text-xs">ID</th>
                    <th className="py-4 px-4 font-medium text-gray-500 uppercase text-xs">Movie</th>
                    <th className="py-4 px-4 font-medium text-gray-500 uppercase text-xs">User</th>
                    <th className="py-4 px-4 font-medium text-gray-500 uppercase text-xs">Date</th>
                    <th className="py-4 px-4 font-medium text-gray-500 uppercase text-xs text-right">Amount</th>
                </tr>
                </thead>
                <tbody>
                {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((item, index) => (
                    <tr key={index} className="border-b border-stroke dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-4 px-4 text-sm font-medium text-black dark:text-white">
                            {item.id || `#${index + 1}`}
                        </td>
                        <td className="py-4 px-4 text-sm font-bold text-black dark:text-white">
                            {item.movie}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500">
                            {item.user}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500">
                            {formatDate(item.date || item.bookingDate)}
                        </td>
                        <td className="py-4 px-4 text-right">
                            <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                                {formatVND(Number(item.amount))}
                            </span>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                            No transactions found for this period.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}