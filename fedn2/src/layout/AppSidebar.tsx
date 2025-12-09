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
  Home,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

export default function AppSidebar() {
  const pathname = usePathname();
  const sidebar = useSidebar();
  if (!sidebar) return null;
  const { isMobileOpen, toggleSidebarMobile } = sidebar;

  const isActive = (path: string) => pathname === path;

  const contentLinks = [
    { name: "Movies", path: "/admin/movies", icon: Film },
    { name: "Cinemas", path: "/admin/cinemas", icon: Monitor },
    { name: "Showtimes", path: "/admin/showtimes", icon: Calendar },
    { name: "Rooms/Movies", path: "/admin/screens", icon: Monitor },
  ];

  const businessLinks = [
    { name: "Revenue", path: "/admin/revenue", icon: BarChart3 },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen w-[290px] flex-col overflow-y-hidden bg-[#1c2434] text-white duration-300 ease-linear lg:translate-x-0 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-6 py-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-2xl font-bold tracking-wide">
          <Film className="h-8 w-8 text-blue-500" />
          <span>Admin</span>
        </Link>
        <button onClick={toggleSidebarMobile} className="block text-gray-400 lg:hidden">
          ✕
        </button>
      </div>

      {/* User */}
      <div className="mb-4 flex items-center gap-3 border-b border-gray-700/50 px-6 pb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold shadow-md">
          AD
        </div>
        <div>
          <h4 className="text-sm font-semibold">Administrator</h4>
          <p className="text-xs text-gray-400">System Admin</p>
        </div>
      </div>

      {/* Menu */}
      <div className="no-scrollbar flex flex-col overflow-y-auto px-4">
        <nav className="space-y-6">
          {/* Main */}
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

          {/* Content */}
          <div>
            <h3 className="mb-2 ml-4 text-xs font-semibold uppercase text-gray-400">Content Management</h3>
            <ul className="space-y-1">
              {contentLinks.map((item) => (
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

          {/* Business */}
          <div>
            <h3 className="mb-2 ml-4 text-xs font-semibold uppercase text-gray-400">Business Management</h3>
            <ul className="space-y-1">
              {businessLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="group flex items-center gap-2.5 rounded-lg py-2.5 px-4 font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* System */}
          <div>
            <h3 className="mb-2 ml-4 text-xs font-semibold uppercase text-gray-400">System</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/admin/users"
                  className="group flex items-center gap-2.5 rounded-lg py-2.5 px-4 font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                >
                  <Users className="h-5 w-5" />
                  Users
                </Link>
              </li>
              <li className="mt-4 border-t border-gray-700 pt-4">
                <Link
                  href="/"
                  className="group flex items-center gap-2.5 rounded-lg py-2.5 px-4 font-medium text-blue-400 transition-colors hover:bg-blue-600/10"
                >
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
