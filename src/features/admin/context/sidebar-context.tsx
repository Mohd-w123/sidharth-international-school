"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface SidebarContextValue {
  isOpen: boolean;
  isMobileOpen: boolean;
  toggle: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  const toggleMobile = useCallback(() => setIsMobileOpen((v) => !v), []);
  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  return (
    <SidebarContext value={{ isOpen, isMobileOpen, toggle, toggleMobile, closeMobile }}>
      {children}
    </SidebarContext>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}
