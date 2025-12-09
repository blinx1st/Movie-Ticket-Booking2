"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { message } from "antd";
import { sendRequest } from "@/utils/api";
import { Plus, Monitor, Trash2, Save, X, Building2 } from "lucide-react";

type Cinema = { id: number; name: string };
type Room = { id: number; name: string; capacity: number; type?: string; cinemaId?: number };
type Seat = { id: number; row: string; number: number; type: string; isBooked?: boolean };

export default function ScreensPage() {
  const { data: session } = useSession();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", capacity: "", type: "2D", cinemaId: "" });
  const [seedLoading, setSeedLoading] = useState(false);

  const accessToken = useMemo(() => {
    const tokenFromSession = (session?.user as any)?.access_token;
    const tokenRoot = (session as any)?.access_token;
    if (tokenFromSession) return tokenFromSession as string;
    if (tokenRoot) return tokenRoot as string;
    if (typeof window !== "undefined") return localStorage.getItem("token");
    return null;
  }, [session]);
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  const ensureOk = (res: any) => {
    if (res && typeof res === "object" && (res as any).statusCode && (res as any).statusCode >= 400) {
      throw new Error((res as any).message || "Request failed");
    }
  };

  const fetchCinemas = async () => {
    try {
      const res = await sendRequest<IBackendRes<Cinema[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cinemas`,
        method: "GET",
        headers,
      });
      ensureOk(res);
      if (Array.isArray(res?.data)) setCinemas(res.data);
    } catch (err: any) {
      message.error(err?.message || "Cannot load cinemas");
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
      ensureOk(res);
      if (Array.isArray(res?.data)) setRooms(res.data);
    } catch (err: any) {
      message.error(err?.message || "Cannot load rooms");
      setRooms([]);
    }
  };

  const fetchSeats = async (roomId: number) => {
    try {
      const res = await sendRequest<IBackendRes<Seat[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/seats`,
        method: "GET",
        queryParams: { roomId },
        headers,
      });
      if (Array.isArray(res?.data)) setSeats(res.data);
    } catch (err: any) {
      message.error(err?.message || "Cannot load seats");
      setSeats([]);
    }
  };

  useEffect(() => {
    fetchCinemas();
    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchSeats(selectedRoom.id);
    } else {
      setSeats([]);
    }
  }, [selectedRoom]);

  const cinemaName = (id?: number) => cinemas.find((c) => c.id === id)?.name || "—";

  const openModal = (room?: Room) => {
    if (room) {
      setEditingId(room.id);
      setFormData({
        name: room.name,
        capacity: room.capacity.toString(),
        type: room.type || "2D",
        cinemaId: room.cinemaId ? room.cinemaId.toString() : "",
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", capacity: "", type: "2D", cinemaId: "" });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.capacity) {
      message.warning("Please fill all fields");
      return;
    }
    const payload = {
      name: formData.name,
      capacity: Number(formData.capacity),
      type: formData.type || "2D",
      cinemaId: formData.cinemaId ? Number(formData.cinemaId) : undefined,
    };
    try {
      if (editingId) {
        const res = await sendRequest({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cinema-rooms/${editingId}`,
          method: "PUT",
          body: payload,
          headers,
        });
        ensureOk(res);
        message.success("Updated room");
      } else {
        const res = await sendRequest({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cinema-rooms`,
          method: "POST",
          body: payload,
          headers,
        });
        ensureOk(res);
        message.success("Created room");
      }
      setShowModal(false);
      fetchRooms();
    } catch (err: any) {
      message.error(err?.message || "Save failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this room?")) return;
    try {
      const res = await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cinema-rooms/${id}`,
        method: "DELETE",
        headers,
      });
      ensureOk(res);
      message.success("Deleted");
      fetchRooms();
      if (selectedRoom?.id === id) {
        setSelectedRoom(null);
        setSeats([]);
      }
    } catch (err: any) {
      message.error(err?.message || "Delete failed");
    }
  };

  const handleSeedDefault = async () => {
    if (!selectedRoom) return;
    setSeedLoading(true);
    try {
      const res = await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/seats/seed`,
        method: "POST",
        body: { roomId: selectedRoom.id, rows: ["A:8", "B:8", "C:8", "D:8"] },
        headers,
      });
      ensureOk(res);
      message.success("Seeded 4 rows x 8 seats");
      fetchSeats(selectedRoom.id);
    } catch (err: any) {
      message.error(err?.message || "Seed failed");
    } finally {
      setSeedLoading(false);
    }
  };

  const addSeat = async () => {
    if (!selectedRoom) return;
    const row = prompt("Row letter (e.g. A)");
    const number = prompt("Seat number (e.g. 9)");
    if (!row || !number) return;
    try {
      const res = await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/seats`,
        method: "POST",
        headers,
        body: {
          row: row.trim().toUpperCase(),
          number: Number(number),
          roomId: selectedRoom.id,
          type: "Standard",
        },
      });
      ensureOk(res);
      message.success("Seat added");
      fetchSeats(selectedRoom.id);
    } catch (err: any) {
      message.error(err?.message || "Add seat failed");
    }
  };

  const groupedSeats = seats.reduce<Record<string, Seat[]>>((acc, seat) => {
    acc[seat.row] = acc[seat.row] || [];
    acc[seat.row].push(seat);
    return acc;
  }, {});
  Object.keys(groupedSeats).forEach((row) => {
    groupedSeats[row].sort((a, b) => a.number - b.number);
  });

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-black dark:text-white">Screens / Rooms</h2>
        <nav>
          <ol className="flex items-center gap-2 text-sm font-medium">
            <li><Link href="/dashboard" className="hover:text-blue-600">Home / Admin /</Link></li>
            <li className="text-blue-600">Screens</li>
          </ol>
        </nav>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-gray-700 dark:bg-gray-800">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex flex-col md:flex-row justify-between items-center gap-4">
          <h4 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
            <Monitor className="w-5 h-5 text-blue-500" /> Room Management
          </h4>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-blue-600 py-2 px-6 text-center font-medium text-white hover:bg-blue-700"
          >
            <Plus className="w-5 h-5"/> Add Room
          </button>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left dark:bg-gray-700">
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-sm xl:pl-11">NAME</th>
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-sm">CAPACITY</th>
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-sm">TYPE</th>
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-sm">CINEMA</th>
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-sm text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length > 0 ? rooms.map((room) => (
                <tr key={room.id} className="border-b border-stroke dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-4 px-4 xl:pl-11 font-bold text-black dark:text-white">{room.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-200">{room.capacity} seats</td>
                  <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-200">{room.type || "2D"}</td>
                  <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-200">{cinemaName(room.cinemaId)}</td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openModal(room)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 font-medium">
                        Edit
                      </button>
                      <button
                        onClick={() => setSelectedRoom(room)}
                        className="text-xs rounded border border-green-600 px-3 py-1 font-semibold text-green-600 hover:bg-green-50"
                      >
                        Seat map
                      </button>
                      <button onClick={() => handleDelete(room.id)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">No rooms. Create one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRoom && (
        <div className="mt-6 rounded-sm border border-stroke bg-white shadow-default dark:border-gray-700 dark:bg-gray-800 p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h4 className="text-lg font-bold text-black dark:text-white">Seat map - {selectedRoom.name}</h4>
                <p className="text-sm text-gray-500">Room ID: {selectedRoom.id}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleSeedDefault}
                  disabled={seedLoading}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {seedLoading ? "Seeding..." : "Seed 4x8"}
                </button>
                <button
                  onClick={addSeat}
                  className="inline-flex items-center gap-2 rounded-md border border-blue-600 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                >
                  Add seat
                </button>
                <button
                  onClick={async () => {
                    if (!selectedRoom) return;
                    if (!confirm("Clear all seats in this room?")) return;
                    try {
                      const res = await sendRequest({
                        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/seats/by-room`,
                        method: "DELETE",
                        headers,
                        queryParams: { roomId: selectedRoom.id },
                      });
                      ensureOk(res);
                      message.success("Cleared all seats");
                      fetchSeats(selectedRoom.id);
                    } catch (err: any) {
                      message.error(err?.message || "Clear failed");
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-md border border-red-600 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Clear seat map
                </button>
              </div>
            </div>

          <div className="mt-4 space-y-3">
            {Object.keys(groupedSeats).length === 0 && (
              <p className="text-sm text-gray-500">No seats. Seed to generate layout.</p>
            )}
            {Object.keys(groupedSeats)
              .sort()
              .map((row) => (
                <div key={row} className="flex items-center gap-3">
                  <span className="w-6 text-right text-xs font-semibold text-gray-500">{row}</span>
                  <div className="flex flex-wrap gap-2">
                    {groupedSeats[row].map((seat) => (
                      <span
                        key={seat.id}
                        className="inline-flex items-center justify-center rounded border border-stroke px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200 dark:border-gray-600"
                      >
                        {seat.row}
                        {seat.number}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-2xl dark:bg-gray-800">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                        <Monitor className="w-6 h-6 text-blue-600"/>
                        {editingId ? "Edit Room" : "Add Room"}
                    </h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Name</label>
                        <input
                          type="text"
                          className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Capacity</label>
                        <input
                          type="number"
                          className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                          value={formData.capacity}
                          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-black dark:text-white">Type</label>
                            <input
                              type="text"
                              className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                              value={formData.type}
                              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-black dark:text-white">Cinema</label>
                            <select
                              className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                              value={formData.cinemaId}
                              onChange={(e) => setFormData({ ...formData, cinemaId: e.target.value })}
                            >
                              <option value="">-- Optional --</option>
                              {cinemas.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                        </div>
                    </div>

                    <button
                      onClick={handleSave}
                      className="flex w-full items-center justify-center gap-2 rounded bg-blue-600 p-3 font-medium text-white hover:bg-blue-700 transition"
                    >
                      <Save className="w-5 h-5"/> {editingId ? "Update Room" : "Save Room"}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
