"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Calendar, Pencil, Trash2, Clock, DollarSign, Film, Monitor, X, Save } from "lucide-react";

export default function ShowtimesPage() {
  // State chứa dữ liệu chính
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [screens, setScreens] = useState<any[]>([]);

  // State cho Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form dữ liệu
  const [formData, setFormData] = useState({
    movieId: "",
    screenId: "",
    startTime: "",
    price: "",
  });

  // 1. LOAD TẤT CẢ DỮ LIỆU TỪ KHO (Local Storage)
  useEffect(() => {
    // Load Movies
    const savedMovies = localStorage.getItem("adminMovies");
    if (savedMovies) setMovies(JSON.parse(savedMovies));
    
    // Load Screens
    const savedScreens = localStorage.getItem("adminScreens");
    if (savedScreens) setScreens(JSON.parse(savedScreens));

    // Load Showtimes (Dữ liệu chính của trang này)
    const savedShowtimes = localStorage.getItem("adminShowtimes");
    if (savedShowtimes) {
      setShowtimes(JSON.parse(savedShowtimes));
    } else {
      // Dữ liệu mẫu ban đầu nếu chưa có gì
      setShowtimes([
        { id: 1, movieId: "1", screenId: "1", startTime: "2025-06-18T20:20", price: 120000 },
        { id: 2, movieId: "2", screenId: "3", startTime: "2025-06-18T15:15", price: 150000 },
      ]);
    }
  }, []);

  // 2. Tự động lưu Showtimes khi thay đổi
  useEffect(() => {
    if (showtimes.length > 0) {
      localStorage.setItem("adminShowtimes", JSON.stringify(showtimes));
    }
  }, [showtimes]);

  // Hàm hỗ trợ lấy Tên Phim từ ID
  const getMovieName = (id: string) => {
    const movie = movies.find(m => m.id.toString() === id.toString());
    return movie ? movie.title : "Unknown Movie";
  };

  // Hàm hỗ trợ lấy Tên Phòng từ ID
  const getScreenName = (id: string) => {
    const screen = screens.find(s => s.id.toString() === id.toString());
    return screen ? screen.name : "Unknown";
  };

  // Mở modal thêm/sửa
  const openModal = (item?: any) => {
    if (item) {
      // Chế độ Sửa
      setEditingId(item.id);
      setFormData({
        movieId: item.movieId,
        screenId: item.screenId,
        startTime: item.startTime,
        price: item.price.toString(),
      });
    } else {
      // Chế độ Thêm mới
      setEditingId(null);
      setFormData({ movieId: "", screenId: "", startTime: "", price: "" });
    }
    setShowModal(true);
  };

  // Xử lý Lưu
  const handleSave = () => {
    if (!formData.movieId || !formData.screenId || !formData.startTime || !formData.price) {
      alert("Please fill all fields!");
      return;
    }

    const priceNum = parseInt(formData.price);
    const newShowtime = {
      id: editingId || Date.now(),
      movieId: formData.movieId,
      screenId: formData.screenId,
      startTime: formData.startTime,
      price: priceNum,
    };

    if (editingId) {
      setShowtimes(showtimes.map(s => s.id === editingId ? newShowtime : s));
    } else {
      setShowtimes([...showtimes, newShowtime]);
    }
    setShowModal(false);
  };

  // Xử lý Xóa
  const handleDelete = (id: number) => {
    if (confirm("Delete this showtime?")) {
      const newOne = showtimes.filter(s => s.id !== id);
      setShowtimes(newOne);
      if (newOne.length === 0) localStorage.removeItem("adminShowtimes");
    }
  };

  // Format ngày giờ và tiền tệ cho đẹp
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", hour12: true
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Breadcrumb */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-black dark:text-white">Showtimes</h2>
        <nav>
          <ol className="flex items-center gap-2 text-sm font-medium">
            <li><Link href="/dashboard" className="hover:text-blue-600">Home / Admin /</Link></li>
            <li className="text-blue-600">Showtimes</li>
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-gray-700 dark:bg-gray-800">
        
        {/* Header */}
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex flex-col md:flex-row justify-between items-center gap-4">
          <h4 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
             Showtimes Management
          </h4>
          <button 
            onClick={() => openModal()}
            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-blue-600 py-2 px-6 font-medium text-white hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5"/> Create New
          </button>
        </div>

        {/* Table */}
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left dark:bg-gray-700">
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-sm xl:pl-11">MOVIE</th>
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-sm">SCREEN</th>
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-sm">START TIME</th>
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-sm">PRICE</th>
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-sm text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {showtimes.length > 0 ? (
                showtimes.map((item) => (
                  <tr key={item.id} className="border-b border-stroke dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-4 px-4 xl:pl-11">
                      <p className="font-bold text-black dark:text-white">{getMovieName(item.movieId)}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-green-100 text-green-700 py-1 px-2 rounded font-bold text-sm">
                        {getScreenName(item.screenId)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-black dark:text-white text-sm font-medium">{formatDate(item.startTime)}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-black dark:text-white font-bold">{formatCurrency(item.price)}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openModal(item)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 font-medium">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                          <Trash2 className="w-4 h-4"/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">No showtimes found. Create one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-2xl dark:bg-gray-800">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-blue-600"/> 
                        {editingId ? "Edit Showtime" : "Create New Showtime"}
                    </h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Chọn Phim */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Select Movie</label>
                        <div className="relative">
                            <select 
                                className="w-full rounded border border-stroke bg-transparent py-3 px-10 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 appearance-none"
                                value={formData.movieId}
                                onChange={(e) => setFormData({...formData, movieId: e.target.value})}
                            >
                                <option value="" disabled>-- Choose a movie --</option>
                                {movies.map(m => (
                                    <option key={m.id} value={m.id}>{m.title}</option>
                                ))}
                            </select>
                            <Film className="absolute left-3 top-3.5 w-5 h-5 text-gray-500"/>
                        </div>
                    </div>

                    {/* Chọn Phòng & Giá (Trên 1 hàng) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-black dark:text-white">Screen</label>
                            <div className="relative">
                                <select 
                                    className="w-full rounded border border-stroke bg-transparent py-3 px-10 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 appearance-none"
                                    value={formData.screenId}
                                    onChange={(e) => setFormData({...formData, screenId: e.target.value})}
                                >
                                    <option value="" disabled>-- Screen --</option>
                                    {screens.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.capacity} seats)</option>
                                    ))}
                                </select>
                                <Monitor className="absolute left-3 top-3.5 w-5 h-5 text-gray-500"/>
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-black dark:text-white">Price (VND)</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    placeholder="120000"
                                    className="w-full rounded border border-stroke bg-transparent py-3 px-10 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                />
                                <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-500"/>
                            </div>
                        </div>
                    </div>

                    {/* Chọn Ngày Giờ */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Start Time</label>
                        <div className="relative">
                            <input 
                                type="datetime-local" 
                                className="w-full rounded border border-stroke bg-transparent py-3 px-10 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                value={formData.startTime}
                                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                            />
                            <Clock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500"/>
                        </div>
                    </div>

                    <button 
                        onClick={handleSave}
                        className="flex w-full items-center justify-center gap-2 rounded bg-blue-600 p-3 font-medium text-white hover:bg-blue-700 transition mt-4"
                    >
                        <Save className="w-5 h-5"/> {editingId ? "Update Showtime" : "Create Showtime"}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}