"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
import AppSidebar from "@/layout/AppSidebar";
import AppHeader from "@/layout/AppHeader";
import Backdrop from "@/layout/Backdrop";
import TokenSync from "@/components/auth/token-sync";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen xl:flex bg-gray-100 dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      <AppSidebar />
      <Backdrop />
      <div className="flex-1 transition-all duration-300 ease-in-out lg:ml-[290px]">
        <AppHeader />
        <div className="p-4 mx-auto max-w-screen-2xl md:p-6">{children}</div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <SidebarProvider>
          <TokenSync />
          <AdminLayoutContent>{children}</AdminLayoutContent>
        </SidebarProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
