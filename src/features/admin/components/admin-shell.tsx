"use client";

import { SidebarProvider } from "@/features/admin/context/sidebar-context";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { MobileNav } from "./mobile-nav";

interface AdminShellProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
  permissions: string[];
}

export function AdminShell({ children, user, permissions }: AdminShellProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar permissions={permissions} />
        <MobileNav permissions={permissions} />
        <div className="flex flex-1 flex-col">
          <AdminHeader user={user} />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
