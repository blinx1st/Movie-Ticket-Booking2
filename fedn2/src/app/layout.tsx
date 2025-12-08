import "./globals.css";
import React from "react";

export const metadata = {
  title: "GenZmephim",
  description: "Trang đặt vé xem phim",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Thêm suppressHydrationWarning={true} vào body để tắt lỗi do extension */}
      <body suppressHydrationWarning={true} className="bg-[#020d1e] text-white">
        {children}
      </body>
    </html>
  );
}
