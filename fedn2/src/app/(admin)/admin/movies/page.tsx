"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { message } from "antd";
import { sendRequest, sendRequestFile } from "@/utils/api";
import { Plus, Search, Pencil, Trash2, Eye, Film, X, Upload, Calendar, BadgeDollarSign } from "lucide-react";

type Movie = {
  id: number;
  title: string;
  description: string;
  genre: string;
  durationMinutes: number;
  ticketPrice: number;
  posterUrl: string;
  bannerUrl?: string;
  releaseDate: string;
  status: string;
  format: string;
  rating: number;
  language: string;
};

type MovieForm = {
  title: string;
  description: string;
  genre: string;
  durationMinutes: string;
  ticketPrice: string;
  posterUrl: string;
  bannerUrl: string;
  status: string;
  format: string;
  rating: string;
  language: string;
  releaseDate: string;
};

const emptyForm: MovieForm = {
  title: "",
  description: "",
  genre: "",
  durationMinutes: "",
  ticketPrice: "",
  posterUrl: "",
  bannerUrl: "",
  status: "Now Showing",
  format: "2D",
  rating: "0",
  language: "English",
  releaseDate: "",
};

export default function MoviesPage() {
  const { data: session } = useSession();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<MovieForm>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [posterList, setPosterList] = useState<string[]>([]);
  const [loadingPosters, setLoadingPosters] = useState(false);

  const accessToken = useMemo(() => {
    const tokenFromSession = (session?.user as any)?.access_token;
    const tokenFromSessionRoot = (session as any)?.access_token;
    if (tokenFromSession) return tokenFromSession as string;
    if (tokenFromSessionRoot) return tokenFromSessionRoot as string;
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) return storedToken;
    }
    return null;
  }, [session?.user]);

  const fetchMovies = async () => {
    if (!accessToken) {
      setError("Please sign in to manage movies.");
      setMovies([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await sendRequest<IBackendRes<Movie[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies`,
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (Array.isArray(res?.data)) {
        setMovies(res.data);
      } else {
        throw new Error(res?.message || "Unable to fetch movies");
      }
    } catch (err: any) {
      setError(err?.message || "Unable to fetch movies");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken !== null) {
      fetchMovies();
    }
  }, [accessToken]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowModal(true);
    fetchPosters();
  };

  const openEditModal = (movie: Movie) => {
    setEditingId(movie.id);
    setFormData({
      title: movie.title || "",
      description: movie.description || "",
      genre: movie.genre || "",
      durationMinutes: movie.durationMinutes?.toString() || "",
      ticketPrice: movie.ticketPrice?.toString() || "",
      posterUrl: movie.posterUrl || "",
      bannerUrl: movie.bannerUrl || "",
      status: movie.status || "Now Showing",
      format: movie.format || "2D",
      rating: movie.rating?.toString() || "0",
      language: movie.language || "English",
      releaseDate: movie.releaseDate ? movie.releaseDate.slice(0, 10) : "",
    });
    setShowModal(true);
    fetchPosters();
  };

  const handleSave = async () => {
    if (!formData.title || !formData.genre || !formData.durationMinutes || !formData.ticketPrice || !formData.releaseDate) {
      message.warning("Please fill in Title, Genre, Duration, Price, and Release Date.");
      return;
    }

    const duration = Number(formData.durationMinutes);
    const price = Number(formData.ticketPrice);
    if (Number.isNaN(duration) || duration <= 0) {
      message.warning("Duration must be a positive number (minutes).");
      return;
    }
    if (Number.isNaN(price) || price < 0) {
      message.warning("Ticket price must be a valid number.");
      return;
    }

    if (!accessToken) {
      message.error("Please sign in to manage movies.");
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      genre: formData.genre,
      durationMinutes: duration,
      ticketPrice: price,
      posterUrl: formData.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
      bannerUrl: formData.bannerUrl || undefined,
      status: formData.status || "Now Showing",
      format: formData.format || "2D",
      rating: Number(formData.rating) || 0,
      language: formData.language || "English",
      releaseDate: formData.releaseDate,
    };

    const headers = { Authorization: `Bearer ${accessToken}` };

    try {
      if (editingId) {
        const res = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies/${editingId}`,
          method: "PATCH",
          body: payload,
          headers,
        });

        if (+res.statusCode >= 200 && +res.statusCode < 300) {
          message.success("Movie updated successfully.");
          setShowModal(false);
          fetchMovies();
        } else {
          throw new Error(res?.message || "Update failed.");
        }
      } else {
        const res = await sendRequest<IBackendRes<Movie>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies`,
          method: "POST",
          body: payload,
          headers,
        });

        if (res?.data?.id) {
          message.success("Movie created successfully.");
          setShowModal(false);
          fetchMovies();
        } else {
          throw new Error(res?.message || "Create failed.");
        }
      }
    } catch (err: any) {
      message.error(err?.message || "Something went wrong.");
    }
  };

  const handleUploadPoster = async (file: File) => {
    if (!file) return;
    if (!accessToken) {
      message.error("Please sign in to upload poster.");
      return;
    }
    const form = new FormData();
    form.append("file", file);
    setUploading(true);
    try {
      const res = await sendRequestFile<IBackendRes<{ imageUrl: string }>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies/upload-poster`,
        method: "POST",
        body: form,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res?.data?.imageUrl) {
        setFormData((prev) => ({ ...prev, posterUrl: res.data!.imageUrl }));
        message.success("Poster uploaded.");
      } else {
        throw new Error(res?.message || "Upload failed.");
      }
    } catch (err: any) {
      message.error(err?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const fetchPosters = async () => {
    if (!accessToken) return;
    setLoadingPosters(true);
    try {
      const res = await sendRequest<IBackendRes<{ files: string[] }>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies/posters`,
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res?.data?.files) {
        const normalized = res.data.files.map((f) =>
          f.startsWith("http") ? f : `${process.env.NEXT_PUBLIC_BACKEND_URL}${f}`
        );
        setPosterList(normalized);
      } else {
        setPosterList([]);
      }
    } catch {
      setPosterList([]);
    } finally {
      setLoadingPosters(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;
    if (!accessToken) {
      message.error("Please sign in to manage movies.");
      return;
    }

    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies/${id}`,
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (+res.statusCode >= 200 && +res.statusCode < 300) {
      message.success("Movie deleted successfully.");
      fetchMovies();
    } else {
      message.error(res?.message || "Delete failed.");
    }
  };

const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 relative">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-black dark:text-white">Movies</h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li><Link className="font-medium" href="/dashboard">Home / Admin /</Link></li>
            <li className="font-medium text-blue-600">Movies</li>
          </ol>
        </nav>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-gray-700 dark:bg-gray-800">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex flex-col md:flex-row justify-between items-center gap-4">
          <h4 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
             <Film className="w-6 h-6"/> Movie List
          </h4>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
                <input 
                    type="text" 
                    placeholder="Search movie..." 
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>

            <button 
                onClick={openAddModal}
                className="flex items-center gap-2 rounded bg-blue-600 py-2 px-4.5 font-medium text-white hover:bg-blue-700 transition whitespace-nowrap"
            >
                <Plus className="w-5 h-5" /> Add New Movie
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-4 mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/30 dark:text-red-100">
            {error}
          </div>
        )}

        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left dark:bg-gray-700">
                <th className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">TITLE</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">GENRE</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">DURATION</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">PRICE</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">RELEASE DATE</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-6 px-4 text-center text-sm text-gray-500 dark:text-gray-300">
                    Loading movies...
                  </td>
                </tr>
              ) : filteredMovies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 px-4 text-center text-sm text-gray-500 dark:text-gray-300">
                    No movies found.
                  </td>
                </tr>
              ) : (
                filteredMovies.map((movie) => (
                  <tr key={movie.id} className="border-b border-stroke dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-5 px-4 pl-9 xl:pl-11">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="h-12.5 w-15 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={
                              movie.posterUrl ||
                              "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80"
                            }
                            alt="Poster"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-black dark:text-white">{movie.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 max-w-[280px]">{movie.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4"><p className="text-black dark:text-white text-sm">{movie.genre}</p></td>
                    <td className="py-5 px-4"><p className="text-black dark:text-white text-sm">{movie.durationMinutes} mins</p></td>
                    <td className="py-5 px-4">
                      <p className="text-black dark:text-white text-sm inline-flex items-center gap-1">
                        <BadgeDollarSign className="w-4 h-4" />
                        {movie.ticketPrice}
                      </p>
                    </td>
                    <td className="py-5 px-4">
                      <p className="text-black dark:text-white text-sm inline-flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {movie.releaseDate?.slice(0, 10)}
                      </p>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center space-x-3.5">
                        <button className="hover:text-blue-600"><Eye className="w-5 h-5" /></button>
                        <button 
                          onClick={() => openEditModal(movie)} 
                          className="hover:text-green-600"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(movie.id)} className="hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-2xl dark:bg-gray-800">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-black dark:text-white">
                      {editingId ? "Edit Movie" : "Add New Movie"}
                    </h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Movie Title</label>
                        <input 
                            type="text" 
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-500 active:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-black dark:text-white">Genre</label>
                            <input 
                                type="text" 
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-500 active:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                value={formData.genre}
                                onChange={(e) => setFormData({...formData, genre: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-black dark:text-white">Duration (minutes)</label>
                            <input 
                                type="number" 
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-500 active:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                value={formData.durationMinutes}
                                onChange={(e) => setFormData({...formData, durationMinutes: e.target.value})}
                                min={1}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-black dark:text-white">Ticket Price</label>
                            <input 
                                type="number" 
                                step="0.01"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-500 active:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                value={formData.ticketPrice}
                                onChange={(e) => setFormData({...formData, ticketPrice: e.target.value})}
                                min={0}
                            />
                        </div>
                        <div>
                             <label className="mb-2 block text-sm font-medium text-black dark:text-white">Poster URL</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-500 active:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                    value={formData.posterUrl}
                                    onChange={(e) => setFormData({...formData, posterUrl: e.target.value})}
                                    placeholder="Chọn từ server hoặc nhập URL"
                                />
                                <label className="absolute right-3 top-2.5 inline-flex cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-gray-50 p-1 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
                                  <Upload className="w-5 h-5" />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        handleUploadPoster(file);
                                      }
                                      e.target.value = "";
                                    }}
                                    disabled={uploading}
                                  />
                                </label>
                            </div>
                            <div className="mt-2">
                              <button
                                type="button"
                                onClick={fetchPosters}
                                className="text-xs text-blue-600 hover:underline"
                                disabled={loadingPosters}
                              >
                                {loadingPosters ? "Loading posters..." : "Load posters from server"}
                              </button>
                              {posterList.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                  {posterList.map((poster) => (
                                    <button
                                      type="button"
                                      key={poster}
                                      className={`border rounded-md p-1 hover:border-blue-500 ${
                                        formData.posterUrl === poster ? "border-blue-500" : "border-gray-300 dark:border-gray-600"
                                      }`}
                                      onClick={() => setFormData((prev) => ({ ...prev, posterUrl: poster }))}
                                    >
                                      <img src={poster} alt="poster" className="h-16 w-12 object-cover rounded" />
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-black dark:text-white">Rating</label>
                            <input 
                                type="number" 
                                step="0.1"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-500 active:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                value={formData.rating}
                                onChange={(e) => setFormData({...formData, rating: e.target.value})}
                                min={0}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 md:col-span-1">
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Release Date</label>
                        <input
                          type="date"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-500 active:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                          value={formData.releaseDate}
                          onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Format</label>
                        <input
                          type="text"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-500 active:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                          value={formData.format}
                          onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                          placeholder="2D / 3D / IMAX / 4DX"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Status</label>
                        <select
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-500 active:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                          <option value="Now Showing">Now Showing</option>
                          <option value="Coming Soon">Coming Soon</option>
                          <option value="Hidden">Hidden</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Language</label>
                        <input
                          type="text"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-500 active:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                          value={formData.language}
                          onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Description</label>
                        <textarea 
                            rows={4}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-500 active:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                    </div>

                    <button 
                        onClick={handleSave}
                        className={`flex w-full justify-center rounded p-3 font-medium text-white transition ${editingId ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {editingId ? "Update Movie" : "Create Movie"}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
