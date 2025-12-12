"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Wallet, Calendar, Clock, TrendingUp, Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { sendRequest } from "@/utils/api";
import { message } from "antd";

type SummaryRes = { totalRevenue: number; totalCount: number };
type Booking = {
  id: number;
  totalAmount: number;
  bookingDate: string;
  status: string;
  userId?: number;
  paymentMethod?: string;
  note?: string;
};

export default function RevenuePage() {
  const { data: session } = useSession();
  const [summary, setSummary] = useState<SummaryRes>({ totalRevenue: 0, totalCount: 0 });
  const [transactions, setTransactions] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState("total");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    amount: "",
    status: "Paid",
    paymentMethod: "Manual",
    userId: "",
    movieId: "",
    showtimeId: "",
    note: "",
  });

  const accessToken = useMemo(() => {
    const tokenFromSession = (session?.user as any)?.access_token;
    const tokenRoot = (session as any)?.access_token;
    const tokenUpper = (session as any)?.accessToken;
    if (tokenFromSession) return tokenFromSession as string;
    if (tokenUpper) return tokenUpper as string;
    if (tokenRoot) return tokenRoot as string;
    if (typeof window !== "undefined") return localStorage.getItem("token") || localStorage.getItem("access_token");
    return null;
  }, [session]);
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, txRes] = await Promise.all([
          sendRequest<IBackendRes<SummaryRes>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/revenue/summary`,
            method: "GET",
            headers,
          }),
          sendRequest<IBackendRes<Booking[]>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/revenue/transactions`,
            method: "GET",
            headers,
          }),
        ]);
        if (sumRes?.data) setSummary(sumRes.data);
        if (Array.isArray(txRes?.data)) setTransactions(txRes.data);
      } catch (err: any) {
        message.error(err?.message || "Failed to load revenue");
      }
    };
    fetchData();
  }, [accessToken]);

  const openModal = (item?: Booking) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        amount: item.totalAmount.toString(),
        status: item.status,
        paymentMethod: item.paymentMethod || "Manual",
        userId: item.userId?.toString() || "",
        movieId: "",
        showtimeId: "",
        note: item.note || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        amount: "",
        status: "Paid",
        paymentMethod: "Manual",
        userId: "",
        movieId: "",
        showtimeId: "",
        note: "",
      });
    }
    setShowModal(true);
  };

  const saveTx = async () => {
    if (!formData.amount) {
      message.warning("Nhập số tiền");
      return;
    }
    const payload: any = {
      amount: Number(formData.amount),
      status: formData.status,
      paymentMethod: formData.paymentMethod || "Manual",
      userId: formData.userId ? formData.userId.trim() : undefined,
      movieId: formData.movieId ? Number(formData.movieId) : undefined,
      showtimeId: formData.showtimeId ? Number(formData.showtimeId) : undefined,
      note: formData.note || undefined,
      source: "manual",
    };
    try {
      if (editingId) {
        await sendRequest({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/revenue/transactions/${editingId}`,
          method: "PATCH",
          body: payload,
          headers,
        });
        message.success("Đã cập nhật");
      } else {
        await sendRequest({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/revenue/transactions`,
          method: "POST",
          body: payload,
          headers,
        });
        message.success("Đã tạo giao dịch");
      }
      setShowModal(false);
      const txRes = await sendRequest<IBackendRes<Booking[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/revenue/transactions`,
        method: "GET",
        headers,
      });
      if (Array.isArray(txRes?.data)) setTransactions(txRes.data);
      const sumRes = await sendRequest<IBackendRes<SummaryRes>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/revenue/summary`,
        method: "GET",
        headers,
      });
      if (sumRes?.data) setSummary(sumRes.data);
    } catch (err: any) {
      message.error(err?.message || "Lưu thất bại");
    }
  };

  const deleteTx = async (id: number) => {
    if (!confirm("Xóa giao dịch này?")) return;
    try {
      await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/revenue/transactions/${id}`,
        method: "DELETE",
        headers,
      });
      message.success("Đã xóa");
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      message.error(err?.message || "Xóa thất bại");
    }
  };

  const formatVND = (value: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString("vi-VN");

  const StatCard = ({ id, title, value, count, icon: Icon, color }: any) => {
    const isActive = activeTab === id;
    return (
      <div
        onClick={() => setActiveTab(id)}
        className={`cursor-pointer rounded-xl p-6 text-white shadow-lg relative overflow-hidden transition-all transform duration-300 ${
          isActive ? "scale-105 ring-4 ring-offset-2 ring-blue-200" : "hover:-translate-y-1"
        } ${color}`}
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
        {isActive && <div className="absolute bottom-0 left-0 w-full h-1 bg-white/50 animate-pulse"></div>}
      </div>
    );
  };

  const filtered = transactions.filter((b) => {
    if (activeTab === "total") return true;
    const now = new Date();
    const bDate = new Date(b.bookingDate);
    if (activeTab === "today") return bDate.toDateString() === now.toDateString();
    if (activeTab === "weekly") return (now.getTime() - bDate.getTime()) / (1000 * 60 * 60 * 24) <= 7;
    if (activeTab === "monthly") return bDate.getMonth() === now.getMonth() && bDate.getFullYear() === now.getFullYear();
    return true;
  });

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-black dark:text-white">Revenue Analytics</h2>
        <nav>
          <ol className="flex items-center gap-2 text-sm font-medium">
            <li><Link href="/dashboard" className="hover:text-blue-600">Home / Admin /</Link></li>
            <li className="text-blue-600">Revenue</li>
          </ol>
        </nav>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard id="total" title="Total Revenue" value={summary.totalRevenue} count={summary.totalCount} icon={Wallet} color="bg-blue-600" />
        <StatCard id="monthly" title="Monthly" value={summary.totalRevenue} count={summary.totalCount} icon={Calendar} color="bg-green-600" />
        <StatCard id="weekly" title="Weekly" value={summary.totalRevenue} count={summary.totalCount} icon={Clock} color="bg-purple-600" />
        <StatCard id="today" title="Today" value={summary.totalRevenue} count={summary.totalCount} icon={TrendingUp} color="bg-red-600" />
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-gray-700 dark:bg-gray-800 transition-all duration-300">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 border-b border-stroke dark:border-gray-700 flex justify-between items-center">
          <h4 className="text-xl font-bold text-black dark:text-white uppercase flex items-center gap-2">
            {activeTab} Transactions
            <span className="text-sm font-normal normal-case bg-gray-100 text-gray-500 px-3 py-1 rounded-full">{filtered.length} records</span>
          </h4>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        <div className="p-4 md:p-6 xl:p-7.5">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100 text-left dark:bg-gray-700">
                  <th className="py-4 px-4 font-medium text-gray-500 uppercase text-xs">ID</th>
                  <th className="py-4 px-4 font-medium text-gray-500 uppercase text-xs">User</th>
                  <th className="py-4 px-4 font-medium text-gray-500 uppercase text-xs">Date</th>
                  <th className="py-4 px-4 font-medium text-gray-500 uppercase text-xs">Status</th>
                  <th className="py-4 px-4 font-medium text-gray-500 uppercase text-xs text-right">Amount</th>
                  <th className="py-4 px-4 font-medium text-gray-500 uppercase text-xs text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((item) => (
                    <tr key={item.id} className="border-b border-stroke dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-4 px-4 text-sm font-medium text-black dark:text-white">#{item.id}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{item.userId ?? "N/A"}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{formatDate(item.bookingDate)}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{item.status}</td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                          {formatVND(Number(item.totalAmount))}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openModal(item)}
                            className="flex items-center gap-1 rounded border border-blue-600 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                          >
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => deleteTx(item.id)}
                            className="flex items-center gap-1 rounded border border-red-500 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-2xl dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                {editingId ? "Edit Transaction" : "Add Transaction"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500 transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">Amount (VND)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">Status</label>
                  <select
                    className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">Payment Method</label>
                  <input
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">User ID</label>
                  <input
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                </div>
              
               
              </div>
             

              <button
                onClick={saveTx}
                className="flex w-full items-center justify-center gap-2 rounded bg-blue-600 p-3 font-medium text-white hover:bg-blue-700 transition"
              >
                <Save className="w-5 h-5" /> {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
