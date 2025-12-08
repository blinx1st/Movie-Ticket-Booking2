"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Monitor, Pencil, Trash2, Info, X, Save } from "lucide-react";

// Dữ liệu mẫu (Giống trong ảnh Figure 12)
const defaultScreens = [
  { id: 1, name: "1", capacity: 20 },
  { id: 2, name: "2", capacity: 10 },
  { id: 3, name: "IMAX", capacity: 50 },
];

export default function ScreensPage() {
  const [screens, setScreens] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form dữ liệu
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
  });

  // 1. Load dữ liệu từ LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("adminScreens");
    if (saved) {
      setScreens(JSON.parse(saved));
    } else {
      setScreens(defaultScreens);
    }
  }, []);

  // 2. Lưu dữ liệu khi thay đổi
  useEffect(() => {
    if (screens.length > 0) {
      localStorage.setItem("adminScreens", JSON.stringify(screens));
    }
  }, [screens]);

  // Mở modal thêm mới
  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "", capacity: "" });
    setShowModal(true);
  };

  // Mở modal sửa
  const openEditModal = (screen: any) => {
    setEditingId(screen.id);
    setFormData({
      name: screen.name,
      capacity: screen.capacity.toString(),
    });
    setShowModal(true);
  };

  // Xử lý Lưu
  const handleSave = () => {
    if (!formData.name || !formData.capacity) {
      alert("Please fill in all fields!");
      return;
    }

    const capacityNum = parseInt(formData.capacity);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      alert("Capacity must be a valid number!");
      return;
    }

    if (editingId) {
      // Sửa
      setScreens(screens.map(s => s.id === editingId ? { ...s, name: formData.name, capacity: capacityNum } : s));
    } else {
      // Thêm mới
      const newScreen = {
        id: Date.now(),
        name: formData.name,
        capacity: capacityNum,
      };
      setScreens([...screens, newScreen]);
    }
    setShowModal(false);
  };

  // Xử lý Xóa
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this screen?")) {
      const newScreens = screens.filter(s => s.id !== id);
      setScreens(newScreens);
      // Nếu xóa hết thì xóa luôn trong localstorage để tránh lỗi logic
      if (newScreens.length === 0) localStorage.removeItem("adminScreens");
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* --- Breadcrumb --- */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-black dark:text-white">Screens</h2>
        <nav>
          <ol className="flex items-center gap-2 text-sm font-medium">
            <li><Link href="/dashboard" className="hover:text-blue-600">Home / Admin /</Link></li>
            <li className="text-blue-600">Screens</li>
          </ol>
        </nav>
      </div>

      {/* --- Main Content --- */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-gray-700 dark:bg-gray-800">
        
        {/* Header Card */}
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-stroke dark:border-gray-700">
          <h4 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
             Movie Screens
          </h4>
          <button 
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-blue-600 py-2 px-6 text-center font-medium text-white hover:bg-blue-700"
          >
            <Plus className="w-5 h-5"/> Add New Screen
          </button>
        </div>

        {/* Table */}
        <div className="p-4 md:p-6 xl:p-7.5">
          <div className="flex flex-col">
            {/* Table Header */}
            <div className="grid grid-cols-3 rounded-sm bg-gray-100 dark:bg-gray-700 sm:grid-cols-3 mb-2">
              <div className="p-2.5 xl:p-4"><h5 className="text-sm font-medium uppercase text-gray-500">NAME</h5></div>
              <div className="p-2.5 text-center xl:p-4"><h5 className="text-sm font-medium uppercase text-gray-500">SEAT CAPACITY</h5></div>
              <div className="p-2.5 text-center xl:p-4"><h5 className="text-sm font-medium uppercase text-gray-500">ACTIONS</h5></div>
            </div>

            {/* Table Body */}
            {screens.length > 0 ? (
                screens.map((screen) => (
                <div key={screen.id} className="grid grid-cols-3 border-b border-stroke dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    
                    {/* Name */}
                    <div className="flex items-center p-2.5 xl:p-4">
                    <p className="text-black dark:text-white font-bold text-lg">{screen.name}</p>
                    </div>

                    {/* Seat Capacity (Badge) */}
                    <div className="flex items-center justify-center p-2.5 xl:p-4">
                        <span className="inline-flex rounded-full bg-blue-100 py-1 px-3 text-sm font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-100">
                            {screen.capacity} seats
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-center p-2.5 xl:p-4 gap-2">
                        <button 
                            onClick={() => openEditModal(screen)}
                            className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                        >
                            <Pencil className="w-3 h-3"/> Edit
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-cyan-600 border border-cyan-600 rounded hover:bg-cyan-50 transition">
                            <Info className="w-3 h-3"/> Details
                        </button>
                        <button 
                            onClick={() => handleDelete(screen.id)}
                            className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition"
                        >
                            <Trash2 className="w-3 h-3"/> Delete
                        </button>
                    </div>
                </div>
                ))
            ) : (
                <div className="text-center py-10 text-gray-500">No screens available. Add one!</div>
            )}
            
            {/* Footer Total */}
            <div className="mt-4 pt-4 border-t border-stroke dark:border-gray-700 text-sm text-gray-500">
                Total screens: <span className="font-bold text-black dark:text-white">{screens.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Modal Add/Edit --- */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-2xl dark:bg-gray-800">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                        <Monitor className="w-6 h-6 text-blue-600"/> 
                        {editingId ? "Edit Screen" : "Add New Screen"}
                    </h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Screen Name / Number</label>
                        <input 
                            type="text" 
                            placeholder="Ex: 1, 2, IMAX..." 
                            className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Seat Capacity</label>
                        <input 
                            type="number" 
                            placeholder="Ex: 50" 
                            className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                            value={formData.capacity}
                            onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                        />
                    </div>

                    <button 
                        onClick={handleSave}
                        className="flex w-full items-center justify-center gap-2 rounded bg-blue-600 p-3 font-medium text-white hover:bg-blue-700 transition"
                    >
                        <Save className="w-5 h-5"/> {editingId ? "Update Screen" : "Save Screen"}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}