"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { message } from "antd";
import { sendRequest } from "@/utils/api";
import { Plus, Calendar, Pencil, Trash2, Clock, DollarSign, Film, X, Save, MapPin, Building2 } from "lucide-react";

type Movie = { id: number; title: string };
type Cinema = { id: number; name: string };
type Room = { id: number; name: string; cinemaId?: number; type?: string; capacity?: number };
type Showtime = {
  id: number;
  movieId: number;
  cinemaId: number;
  cinema?: string;
  city?: string;
  roomId?: number;
  times: string[];
  startTime: string;
  price: number;
  room?: string;
};

export default function ShowtimesPage() {
  const { data: session } = useSession();
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    movieId: "",
    cinemaId: "",
    roomId: "",
    city: "",
    timesText: "",
    startTime: "",
    price: "",
  });

  const accessToken = useMemo(() => {
    const tokenFromSession = (session?.user as any)?.access_token;
    const tokenRoot = (session as any)?.access_token;
    if (tokenFromSession) return tokenFromSession as string;
    if (tokenRoot) return tokenRoot as string;
    if (typeof window !== "undefined") return localStorage.getItem("token");
    return null;
  }, [session]);
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  const fetchMovies = async () => {
    try {
      const res = await sendRequest<IBackendRes<Movie[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies`,
        method: "GET",
      });
      if (Array.isArray(res?.data)) setMovies(res.data);
    } catch {
      setMovies([]);
    }
  };

  const fetchCinemas = async () => {
    try {
      const res = await sendRequest<IBackendRes<Cinema[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cinemas`,
        method: "GET",
      });
      if (Array.isArray(res?.data)) setCinemas(res.data);
    } catch {
      setCinemas([]);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await sendRequest<IBackendRes<Room[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cinema-rooms`,
        method: "GET",
        headers,
      });
      if (Array.isArray(res?.data)) setRooms(res.data);
    } catch {
      setRooms([]);
    }
  };

  const fetchShowtimes = async () => {
    try {
      const res = await sendRequest<IBackendRes<Showtime[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/showtimes`,
        method: "GET",
        headers,
      });
      if (Array.isArray(res?.data)) setShowtimes(res.data);
    } catch {
      setShowtimes([]);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchCinemas();
    fetchRooms();
  }, []);

  useEffect(() => {
    fetchShowtimes();
  }, [accessToken]);

  const getMovieName = (id: number | string) => {
    const movie = movies.find((m) => m.id.toString() === id.toString());
    return movie ? movie.title : "Unknown Movie";
  };

  const getCinemaName = (id: number | string | undefined) => {
    const cinema = cinemas.find((c) => c.id.toString() === (id ?? "").toString());
    return cinema ? cinema.name : "Unknown Cinema";
  };

  const getRoomName = (id: number | string | undefined) => {
    const room = rooms.find((r) => r.id.toString() === (id ?? "").toString());
    return room ? room.name : "No room";
  };

  const openModal = (item?: Showtime) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        movieId: item.movieId.toString(),
        cinemaId: item.cinemaId?.toString() || "",
        city: item.city || "",
        timesText: item.times?.join(", ") || "",
        startTime: item.startTime ? item.startTime.slice(0, 16) : "",
        price: item.price?.toString() || "",
        roomId: item.roomId?.toString() || "",
      });
    } else {
      setEditingId(null);
      setFormData({ movieId: "", cinemaId: "", roomId: "", city: "", timesText: "", startTime: "", price: "" });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.movieId || !formData.cinemaId || !formData.roomId || !formData.startTime || !formData.price) {
      message.warning("Please fill Movie, Cinema, Room, Start Time and Price.");
      return;
    }
    const times = formData.timesText
      ? formData.timesText.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
    const payload = {
      movieId: Number(formData.movieId),
      cinemaId: Number(formData.cinemaId),
      roomId: Number(formData.roomId),
      city: formData.city || undefined,
      times,
      startTime: formData.startTime,
      price: Number(formData.price),
    };

    try {
      if (editingId) {
        const res = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/showtimes/${editingId}`,
          method: "PATCH",
          body: payload,
          headers,
        });
        if (+res.statusCode >= 200 && +res.statusCode < 300) {
          message.success("Showtime updated.");
          fetchShowtimes();
          setShowModal(false);
        } else {
          throw new Error(res?.message || "Update failed.");
        }
      } else {
        const res = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/showtimes`,
          method: "POST",
          body: payload,
          headers,
        });
        if (res?.data?.id || res?.statusCode === 201) {
          message.success("Showtime created.");
          fetchShowtimes();
          setShowModal(false);
        } else {
          throw new Error(res?.message || "Create failed.");
        }
      }
    } catch (err: any) {
      message.error(err?.message || "Save failed.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this showtime?")) return;
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/showtimes/${id}`,
        method: "DELETE",
        headers,
      });
      if (+res.statusCode >= 200 && +res.statusCode < 300) {
        message.success("Deleted.");
        fetchShowtimes();
      } else {
        message.error(res?.message || "Delete failed.");
      }
    } catch (err: any) {
      message.error(err?.message || "Delete failed.");
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-black dark:text-white">Showtimes</h2>
        <nav>
          <ol className="flex items-center gap-2 text-sm font-medium">
            <li><Link href="/dashboard" className="hover:text-blue-600">Home / Admin /</Link></li>
            <li className="text-blue-600">Showtimes</li>
          </ol>
        </nav>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-gray-700 dark:bg-gray-800">
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

        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left dark:bg-gray-700">
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-sm xl:pl-11">MOVIE</th>
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-sm">CINEMA</th>
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-sm">ROOM</th>
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-sm">TIMES</th>
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
                      <span className="inline-flex items-center gap-1 rounded-md bg-green-100 text-green-700 px-2 py-1 text-xs font-semibold dark:bg-green-900/40 dark:text-green-100">
                        <MapPin className="w-4 h-4" />{getCinemaName(item.cinemaId)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-200">
                      {getRoomName(item.roomId)}
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-xs text-gray-500 dark:text-gray-300">
                        {item.times && item.times.length > 0 ? item.times.join(", ") : "N/A"}
                      </p>
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
                  <td colSpan={6} className="text-center py-10 text-gray-500">No showtimes found. Create one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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

                    <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Select Cinema</label>
                        <div className="relative">
                            <select 
                                className="w-full rounded border border-stroke bg-transparent py-3 px-10 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 appearance-none"
                                value={formData.cinemaId}
                                onChange={(e) => setFormData({...formData, cinemaId: e.target.value, roomId: ""})}
                            >
                                <option value="" disabled>-- Choose a cinema --</option>
                                {cinemas.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-500"/>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Select Room</label>
                        <div className="relative">
                            <select 
                                className="w-full rounded border border-stroke bg-transparent py-3 px-10 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 appearance-none"
                                value={formData.roomId}
                                onChange={(e) => setFormData({...formData, roomId: e.target.value})}
                            >
                                <option value="" disabled>-- Choose a room --</option>
                                {(formData.cinemaId 
                                  ? rooms.filter(r => (r.cinemaId ?? "").toString() === formData.cinemaId)
                                  : rooms
                                ).map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                            <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-500"/>
                        </div>
                        {formData.cinemaId === "" && (
                          <p className="mt-1 text-xs text-gray-500">Select cinema to filter rooms.</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Times (comma separated)</label>
                        <input 
                            type="text" 
                            className="w-full rounded border border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-500 active:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                            value={formData.timesText}
                            onChange={(e) => setFormData({...formData, timesText: e.target.value})}
                            placeholder="18:30, 21:00"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-black dark:text-white">Start Time</label>
                            <div className="relative">
                                <input 
                                    type="datetime-local" 
                                    className="w-full rounded border border-stroke bg-transparent py-3 px-10 outline-none focus:border-blue-500 active:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                />
                                <Clock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500"/>
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-black dark:text-white">Price (VND)</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    placeholder="120000"
                                    className="w-full rounded border border-stroke bg-transparent py-3 px-10 outline-none focus:border-blue-500 active:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                />
                                <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-500"/>
                            </div>
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
