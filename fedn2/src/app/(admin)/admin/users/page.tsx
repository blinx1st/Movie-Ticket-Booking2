"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { message } from "antd";
import { sendRequest } from "@/utils/api";
import { Plus, Pencil, Trash2, User, Users, Shield, Search, X, CheckCircle } from "lucide-react";

type BackendUser = {
  _id: string;
  full_name: string;
  email: string;
  phone?: number;
  role?: string;
  isActive?: boolean;
};

type PaginateMeta = {
  current: number;
  pageSize: number;
  total: number;
};

type UserFormState = {
  full_name: string;
  email: string;
  phone: string;
  password: string;
};

const defaultFormState: UserFormState = {
  full_name: "",
  email: "",
  phone: "",
  password: "",
};

export default function UsersPage() {
  const { data: session } = useSession();

  const [users, setUsers] = useState<BackendUser[]>([]);
  const [pagination, setPagination] = useState<PaginateMeta>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<BackendUser | null>(null);
  const [formData, setFormData] = useState<UserFormState>(defaultFormState);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const accessToken = useMemo(() => {
    const tokenFromSession = (session?.user as any)?.access_token;
    if (tokenFromSession) return tokenFromSession as string;
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) return storedToken;
    }
    return null;
  }, [session?.user]);

  const fetchUsers = useCallback(
    async (page = 1, pageSize = pagination.pageSize, keyword?: string) => {
      setLoading(true);
      setError(null);
      const searchValue = keyword ?? activeSearch;

      if (keyword !== undefined && keyword !== activeSearch) {
        setActiveSearch(keyword);
      }

      try {
        const res = await sendRequest<
          IBackendRes<{
            meta: { current: number; pagesize: number; total: number };
            result: BackendUser[];
          }>
        >({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
          method: "GET",
          queryParams: {
            current: page,
            pagesize: pageSize,
            ...(searchValue ? { full_name: `/${searchValue}/i` } : {}),
          },
        });

        if (res?.data?.result) {
          const meta = res.data.meta || { current: page, pagesize: pageSize, total: res.data.result.length };
          setUsers(res.data.result);
          setPagination({
            current: Number(meta.current) || page,
            pageSize: Number(meta.pagesize) || pageSize,
            total: Number(meta.total) || res.data.result.length,
          });
        } else {
          throw new Error(res?.message || "Unable to fetch users");
        }
      } catch (err: any) {
        setUsers([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
        setError(err?.message || "Unable to fetch users");
      } finally {
        setLoading(false);
      }
    },
    [activeSearch, pagination.pageSize]
  );

  useEffect(() => {
    fetchUsers(1, pagination.pageSize);
  }, [fetchUsers, pagination.pageSize]);

  const openAddModal = () => {
    setEditingUser(null);
    setFormData(defaultFormState);
    setShowModal(true);
  };

  const openEditModal = (user: BackendUser) => {
    setEditingUser(user);
    setFormData({
      full_name: user.full_name || "",
      email: user.email || "",
      phone: user.phone?.toString() || "",
      password: "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.full_name || !formData.email) {
      message.warning("Full name and email are required.");
      return;
    }

    const phoneNumber = formData.phone ? Number(formData.phone) : null;
    if (!editingUser && (phoneNumber === null || Number.isNaN(phoneNumber))) {
      message.warning("Phone is required for new users.");
      return;
    }
    if (formData.phone && Number.isNaN(phoneNumber)) {
      message.warning("Phone must be a valid number.");
      return;
    }
    if (!editingUser && !formData.password) {
      message.warning("Password is required for new users.");
      return;
    }

    if (!accessToken) {
      message.error("Please sign in to manage users.");
      return;
    }

    const headers = { Authorization: `Bearer ${accessToken}` };

    try {
      if (editingUser) {
        const payload: any = {
          _id: editingUser._id,
          full_name: formData.full_name,
          email: formData.email,
        };
        if (phoneNumber !== null && !Number.isNaN(phoneNumber)) {
          payload.phone = phoneNumber;
        }
        if (formData.password) {
          payload.password = formData.password;
        }

        const res = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
          method: "PATCH",
          body: payload,
          headers,
        });

        if (res?.statusCode && +res.statusCode >= 200 && +res.statusCode < 300) {
          message.success("User updated successfully.");
          setShowModal(false);
          fetchUsers(pagination.current, pagination.pageSize, activeSearch);
        } else {
          throw new Error(res?.message || "Update failed.");
        }
      } else {
        const res = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
          method: "POST",
          body: {
            full_name: formData.full_name,
            email: formData.email,
            phone: phoneNumber,
            password: formData.password,
          },
          headers,
        });

        if (res?.data?._id) {
          message.success("User created successfully.");
          setShowModal(false);
          setFormData(defaultFormState);
          fetchUsers(1, pagination.pageSize, activeSearch);
        } else {
          throw new Error(res?.message || "Create failed.");
        }
      }
    } catch (err: any) {
      message.error(err?.message || "Something went wrong.");
    }
  };

  const handleDelete = async (user: BackendUser) => {
    const isAdminRole = (user.role || "").toUpperCase().includes("ADMIN");
    if (isAdminRole) {
      message.warning("Không thể xóa tài khoản ADMIN.");
      return;
    }

    if (!confirm("Are you sure you want to delete this user?")) return;
    if (!accessToken) {
      message.error("Please sign in to manage users.");
      return;
    }

    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${user._id}`,
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res?.statusCode && +res.statusCode >= 200 && +res.statusCode < 300) {
      message.success("User deleted successfully.");
      fetchUsers(pagination.current, pagination.pageSize, activeSearch);
    } else {
      message.error(res?.message || "Delete failed.");
    }
  };

  const handleSearch = () => {
    const keyword = searchInput.trim();
    fetchUsers(1, pagination.pageSize, keyword);
  };

  const totalUsers = pagination.total || users.length;
  const activeUsers = useMemo(() => users.filter((u) => u.isActive).length, [users]);
  const totalAdmins = useMemo(
    () => users.filter((u) => (u.role || "").toUpperCase().includes("ADMIN")).length,
    [users]
  );

  const renderAvatar = (user: BackendUser) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.email || "User")}&background=random`;

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Breadcrumb */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-black dark:text-white">User Management</h2>
        <nav>
          <ol className="flex items-center gap-2 text-sm font-medium">
            <li><Link href="/dashboard" className="hover:text-blue-600">Home / Admin /</Link></li>
            <li className="text-blue-600">User Management</li>
          </ol>
        </nav>
      </div>

      {/* --- 3 STATS CARDS --- */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 mb-6">
        {/* Card 1: Total Users */}
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-gray-700 dark:bg-gray-800 flex items-center justify-between">
            <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">{totalUsers}</h4>
                <span className="text-sm font-medium text-gray-500">Total Users</span>
            </div>
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                <Users className="w-6 h-6"/>
            </div>
        </div>

        {/* Card 2: Active Users */}
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-gray-700 dark:bg-gray-800 flex items-center justify-between">
            <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">{activeUsers}</h4>
                <span className="text-sm font-medium text-gray-500">Active Users</span>
            </div>
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
                <CheckCircle className="w-6 h-6"/>
            </div>
        </div>

        {/* Card 3: Administrators */}
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-gray-700 dark:bg-gray-800 flex items-center justify-between">
            <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">{totalAdmins}</h4>
                <span className="text-sm font-medium text-gray-500">Administrators</span>
            </div>
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400">
                <Shield className="w-6 h-6"/>
            </div>
        </div>
      </div>

      {/* --- USER LIST TABLE --- */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-gray-700 dark:bg-gray-800">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-stroke dark:border-gray-700">
          <h4 className="text-xl font-bold text-black dark:text-white">User List</h4>
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full rounded-md border border-stroke bg-transparent py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                placeholder="Search by name"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={handleSearch}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-white"
              >
                Search
              </button>
              <button
                onClick={() => {
                  setSearchInput("");
                  setActiveSearch("");
                  fetchUsers(1, pagination.pageSize, "");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-white"
              >
                Clear
              </button>
              <button 
                onClick={openAddModal}
                className="inline-flex items-center justify-center gap-2.5 rounded-md bg-blue-600 py-2 px-5 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                <Plus className="w-5 h-5"/> Create User
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-4 my-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/30 dark:text-red-100">
            {error}
          </div>
        )}

        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left dark:bg-gray-700">
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-xs xl:pl-8">Full Name</th>
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-xs">Email</th>
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-xs">Phone</th>
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-xs">Role</th>
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-xs">Status</th>
                <th className="py-4 px-4 font-medium text-gray-500 uppercase text-xs text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-6 px-4 text-center text-sm text-gray-500 dark:text-gray-300">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 px-4 text-center text-sm text-gray-500 dark:text-gray-300">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-stroke dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-4 px-4 xl:pl-8">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full overflow-hidden">
                          <img src={renderAvatar(user)} alt="User" className="h-full w-full object-cover" />
                        </div>
                        <p className="font-medium text-black dark:text-white">{user.full_name}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-black dark:text-white">{user.email}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-black dark:text-white">{user.phone ?? "N/A"}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex rounded-full py-1 px-3 text-xs font-bold ${
                          (user.role || "").toUpperCase().includes("ADMIN")
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {user.role || "USER"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex rounded-full py-1 px-3 text-xs font-bold ${
                          user.isActive
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-amber-100 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          disabled={(user.role || "").toUpperCase().includes("ADMIN")}
                          className={`p-1.5 rounded transition ${
                            (user.role || "").toUpperCase().includes("ADMIN")
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                          title={(user.role || "").toUpperCase().includes("ADMIN") ? "Cannot delete ADMIN" : "Delete user"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL ADD/EDIT USER --- */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-2xl dark:bg-gray-800">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                        <User className="w-6 h-6 text-blue-600"/> 
                        {editingUser ? "Edit User" : "Create New User"}
                    </h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Full Name</label>
                        <input 
                            type="text" 
                            className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                            value={formData.full_name}
                            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Email</label>
                        <input 
                            type="email" 
                            className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Phone</label>
                        <input 
                            type="text" 
                            className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                          Password {editingUser ? "(leave blank to keep current)" : ""}
                        </label>
                        <input 
                            type="password" 
                            className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            placeholder={editingUser ? "Only enter if you want to reset password" : ""}
                        />
                    </div>

                    <button 
                        onClick={handleSave}
                        className="flex w-full items-center justify-center gap-2 rounded bg-blue-600 p-3 font-medium text-white hover:bg-blue-700 transition mt-4"
                    >
                        {editingUser ? "Update User" : "Create User"}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
