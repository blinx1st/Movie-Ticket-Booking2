"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { message } from "antd";
import { sendRequest } from "@/utils/api";
import { Plus, Building2, MapPin, Phone, Pencil, Trash2, Save, X } from "lucide-react";

type Cinema = {
  id: number;
  name: string;
  address?: string;
  city?: string;
  phone?: string;
};

export default function CinemasPage() {
  const { data: session } = useSession();
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", address: "", city: "", phone: "" });

  const accessToken = useMemo(() => {
    const tokenFromSession = (session?.user as any)?.access_token;
    const tokenRoot = (session as any)?.access_token;
    if (tokenFromSession) return tokenFromSession as string;
    if (tokenRoot) return tokenRoot as string;
    if (typeof window !== "undefined") return localStorage.getItem("token");
    return null;
  }, [session]);
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

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

  useEffect(() => {
    fetchCinemas();
  }, []);

  const openModal = (item?: Cinema) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name,
        address: item.address || "",
        city: item.city || "",
        phone: item.phone || "",
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", address: "", city: "", phone: "" });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name) {
      message.warning("Please fill name");
      return;
    }
    const payload = {
      name: formData.name,
      address: formData.address || undefined,
      city: formData.city || undefined,
      phone: formData.phone || undefined,
    };
    try {
      if (editingId) {
        await sendRequest({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cinemas/${editingId}`,
          method: "PATCH",
          body: payload,
          headers,
        });
        message.success("Updated cinema");
      } else {
        await sendRequest({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cinemas`,
          method: "POST",
          body: payload,
          headers,
        });
        message.success("Created cinema");
      }
      setShowModal(false);
      fetchCinemas();
    } catch (err: any) {
      message.error(err?.message || "Save failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this cinema?")) return;
    try {
      await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cinemas/${id}`,
        method: "DELETE",
        headers,
      });
      message.success("Deleted");
      fetchCinemas();
    } catch (err: any) {
      message.error(err?.message || "Delete failed");
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-black dark:text-white">Cinemas</h2>
        <nav>
          <ol className="flex items-center gap-2 text-sm font-medium">
            <li><Link href="/dashboard" className="hover:text-blue-600">Home / Admin /</Link></li>
            <li className="text-blue-600">Cinemas</li>
          </ol>
        </nav>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-gray-700 dark:bg-gray-800">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex flex-col md:flex-row justify-between items-center gap-4">
          <h4 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-500" /> Cinema Management
          </h4>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-blue-600 py-2 px-6 font-medium text-white hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5"/> Add Cinema
          </button>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left dark:bg-gray-700">
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-sm xl:pl-11">NAME</th>
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-sm">ADDRESS</th>
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-sm">CITY</th>
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-sm">PHONE</th>
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-sm text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {cinemas.length > 0 ? cinemas.map((item) => (
                <tr key={item.id} className="border-b border-stroke dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-4 px-4 xl:pl-11">
                    <p className="font-bold text-black dark:text-white">{item.name}</p>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-200">{item.address || "—"}</td>
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-200">{item.city || "—"}</td>
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-200">{item.phone || "—"}</td>
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
              )) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">No cinemas. Create one!</td>
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
                <Building2 className="w-6 h-6 text-blue-600"/>
                {editingId ? "Edit Cinema" : "Add Cinema"}
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
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">Address</label>
                <input
                  type="text"
                  className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">City</label>
                  <input
                    type="text"
                    className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">Phone</label>
                  <input
                    type="text"
                    className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                className="flex w-full items-center justify-center gap-2 rounded bg-blue-600 p-3 font-medium text-white hover:bg-blue-700 transition"
              >
                <Save className="w-5 h-5"/> {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
