"use client";
import React, { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
import AppSidebar from "@/layout/AppSidebar";
import AppHeader from "@/layout/AppHeader";
import Backdrop from "@/layout/Backdrop";
import TokenSync from "@/components/auth/token-sync";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (status === "loading") return;
    if (!role || role.toUpperCase() !== "ADMIN") {
      router.replace("/auth/login");
    }
  }, [role, router, status]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
        Checking permission...
      </div>
    );
  }

  if (role?.toUpperCase() === "ADMIN") {
    return <>{children}</>;
  }

  return null;
}

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
          <AdminGuard>
            <AdminLayoutContent>{children}</AdminLayoutContent>
          </AdminGuard>
        </SidebarProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
