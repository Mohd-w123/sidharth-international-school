"use client";

import { useSidebar } from "@/features/admin/context/sidebar-context";
import { Bell, Menu } from "lucide-react";
import { UserProfileMenu } from "./user-profile-menu";
import { ClearCacheButton } from "./clear-cache-button";

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const { toggleMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 sm:gap-4 border-b bg-background px-4 sm:px-6">
      {/* Mobile menu trigger */}
      <button
        onClick={toggleMobile}
        className="lg:hidden p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </button>

      <div className="flex-1" />

      {/* Clear Cache Button */}
      <ClearCacheButton />

      {/* Notification placeholder */}
      <button className="relative p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
        <Bell className="h-5 w-5" />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent" />
        <span className="sr-only">Notifications</span>
      </button>

      {/* User menu */}
      <UserProfileMenu user={user} />
    </header>
  );
}
