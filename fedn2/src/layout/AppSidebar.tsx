"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Film, 
  Monitor, 
  Calendar,  
  Ticket, 
  BarChart3, 
  Users, 
  Settings, 
  Home 
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

export default function AppSidebar() {
  const pathname = usePathname();
  const sidebar = useSidebar();
  // guard if provider is missing for some reason
  if (!sidebar) return null;
  const { isMobileOpen, toggleSidebarMobile } = sidebar;

  // Kiểm tra link nào đang active để tô màu xanh
  const isActive = (path: string) => pathname === path;

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen w-[290px] flex-col overflow-y-hidden bg-[#1c2434] text-white duration-300 ease-linear lg:translate-x-0 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* LOGO & Header Sidebar */}
      <div className="flex items-center justify-between gap-2 px-6 py-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-2xl font-bold tracking-wide">
          <Film className="h-8 w-8 text-blue-500" />
          <span>Admin</span>
        </Link>
        
        {/* Nút tắt sidebar trên mobile */}
        <button onClick={toggleSidebarMobile} className="block lg:hidden text-gray-400">
           ✕
        </button>
      </div>

      {/* User Profile rút gọn */}
      <div className="px-6 pb-6 mb-4 border-b border-gray-700/50 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm shadow-md">
          AD
        </div>
        <div>
          <h4 className="text-sm font-semibold">Administrator</h4>
          <p className="text-xs text-gray-400">System Admin</p>
        </div>
      </div>

      {/* MENU LIST */}
      <div className="no-scrollbar flex flex-col overflow-y-auto px-4 duration-300 ease-linear">
        <nav className="space-y-6">
          
          {/* Nhóm 1: Main */}
          <div>
            <h3 className="mb-2 ml-4 text-xs font-semibold uppercase text-gray-400">Main Navigation</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/admin/dashboard"
                  className={`group flex items-center gap-2.5 rounded-lg py-2.5 px-4 font-medium transition-colors ${
                    isActive("/dashboard") ? "bg-blue-600 text-white shadow-md" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Nhóm 2: Content */}
              <div>
                <h3 className="mb-2 ml-4 text-xs font-semibold uppercase text-gray-400">Content Management</h3>
                <ul className="space-y-1">
                  {[
                    { name: "Movies", path: "/admin/movies", icon: Film },
                    { name: "Cinemas", path: "/admin/cinemas", icon: Monitor },
                    { name: "Screens", path: "/admin/screens", icon: Monitor },
                    { name: "Showtimes", path: "/admin/showtimes", icon: Calendar }
                  ].map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.path}
                        className={`group flex items-center gap-2.5 rounded-lg py-2.5 px-4 font-medium transition-colors ${
                          isActive(item.path) ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

          {/* Nhóm 3: Business */}
          <div>
            <h3 className="mb-2 ml-4 text-xs font-semibold uppercase text-gray-400">Business Management</h3>
            <ul className="space-y-1">
              {[
                { name: "Bookings", path: "/admin/bookings", icon: Ticket },
                { name: "Revenue", path: "/admin/revenue", icon: BarChart3 },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="group flex items-center gap-2.5 rounded-lg py-2.5 px-4 font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nhóm 4: System */}
          <div>
            <h3 className="mb-2 ml-4 text-xs font-semibold uppercase text-gray-400">System</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/admin/users" className="group flex items-center gap-2.5 rounded-lg py-2.5 px-4 font-medium text-gray-300 hover:bg-gray-800 hover:text-white">
                  <Users className="h-5 w-5" />
                  Users
                </Link>
              </li>
              <li>
                <Link href="/admin/settings" className="group flex items-center gap-2.5 rounded-lg py-2.5 px-4 font-medium text-gray-300 hover:bg-gray-800 hover:text-white">
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
              </li>
              {/* Nút về trang chủ */}
              <li className="pt-4 mt-4 border-t border-gray-700">
                <Link href="/" className="group flex items-center gap-2.5 rounded-lg py-2.5 px-4 font-medium text-blue-400 hover:bg-blue-600/10 transition-colors">
                  <Home className="h-5 w-5" />
                  Back to Home
                </Link>
              </li>
            </ul>
          </div>

        </nav>
      </div>
    </aside>
  );
}
