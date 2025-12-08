"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Mail, Phone, Shield, Save } from "lucide-react";

export default function ProfilePage() {
  // Dữ liệu giả lập người dùng hiện tại
  const [userInfo, setUserInfo] = useState({
    fullname: "System Administrator",
    email: "admin@movieticket.com",
    phone: "0987654321",
    role: "Administrator",
    bio: "Chief System Manager overseeing all operations.",
  });

  const handleUpdate = () => {
    alert("Profile updated successfully (Simulated)");
    // Logic thực tế sẽ gọi API để lưu vào database
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Breadcrumb */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black dark:text-white">My Profile</h2>
        <nav>
          <ol className="flex items-center gap-2 text-sm font-medium">
            <li><Link href="/admin/dashboard" className="hover:text-blue-600">Home / Admin /</Link></li>
            <li className="text-blue-600">Profile</li>
          </ol>
        </nav>
      </div>

      {/* Main Profile Card */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-gray-700 dark:bg-gray-800 p-6 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cột trái: Avatar & Role */}
          <div className="w-full lg:w-1/3 flex flex-col items-center border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 pb-6 lg:pb-0 lg:pr-6">
            <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg">
                SA
            </div>
            <h3 className="text-xl font-bold text-black dark:text-white">{userInfo.fullname}</h3>
            <span className="inline-flex rounded-full bg-purple-100 text-purple-700 py-1 px-3 text-sm font-bold mt-2">
                {userInfo.role}
            </span>
            <p className="text-gray-500 text-sm mt-3 text-center">{userInfo.bio}</p>
          </div>

          {/* Cột phải: Form chỉnh sửa */}
          <div className="w-full lg:w-2/3 space-y-6">
            <h3 className="text-lg font-bold text-black dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center gap-2"><User className="w-5 h-5"/> Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</label>
                    <input type="text" value={userInfo.fullname} onChange={(e) => setUserInfo({...userInfo, fullname: e.target.value})} className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700" />
                </div>
                {/* Email */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">Email Address</label>
                    <input type="email" value={userInfo.email} readOnly disabled className="w-full rounded border border-stroke bg-gray-100 dark:bg-gray-700 py-3 px-4 text-gray-500 cursor-not-allowed" />
                </div>
                 {/* Phone */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">Phone Number</label>
                    <input type="text" value={userInfo.phone} onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})} className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700" />
                </div>
            </div>

            <button onClick={handleUpdate} className="flex items-center gap-2 rounded bg-blue-600 py-3 px-6 font-medium text-white hover:bg-blue-700 transition">
                <Save className="w-5 h-5"/> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}