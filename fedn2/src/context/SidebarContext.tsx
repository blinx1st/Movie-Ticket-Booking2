"use client";

import React, { useState, createContext, useContext, useEffect } from "react";

interface SidebarContextType {
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean; // <--- Biến này để check mobile
  toggleSidebarMobile: () => void; // <--- Hàm này bị thiếu nên báo lỗi
  setIsHovered: (isHovered: boolean) => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isExpanded: true,
  isHovered: false,
  isMobileOpen: false,
  toggleSidebarMobile: () => {},
  setIsHovered: () => {},
  toggleSidebar: () => {},
});

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  // Trạng thái mở rộng trên Desktop
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  
  // Trạng thái mở menu trên Mobile
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  const toggleSidebarMobile = () => {
    setIsMobileOpen((prev) => !prev);
  };

  return (
    <SidebarContext.Provider
      value={{
        isExpanded,
        isHovered,
        isMobileOpen,
        toggleSidebarMobile,
        setIsHovered,
        toggleSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);