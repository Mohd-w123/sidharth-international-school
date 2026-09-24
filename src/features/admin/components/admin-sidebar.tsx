"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/features/admin/context/sidebar-context";
import { adminNavigation, type NavItem } from "@/features/admin/config/navigation";
import { PanelLeftClose, PanelLeft } from "lucide-react";

interface AdminSidebarProps {
  permissions: string[];
}

export function AdminSidebar({ permissions }: AdminSidebarProps) {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const canView = (item: NavItem) => {
    if (!item.permission) return true;
    return permissions.includes(item.permission);
  };

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        {isOpen ? (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="text-sm font-bold text-sidebar-primary-foreground">S</span>
            </div>
            <span className="font-heading font-semibold text-sm">School CMS</span>
          </Link>
        ) : (
          <Link href="/admin" className="mx-auto">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="text-sm font-bold text-sidebar-primary-foreground">S</span>
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {adminNavigation.map((group) => {
          const visibleItems = group.items.filter(canView);
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.title} className="mb-4">
              {isOpen && (
                <p className="px-3 mb-1 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/50">
                  {group.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {visibleItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        isActive(item.href)
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                      title={!isOpen ? item.title : undefined}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {isOpen && <span>{item.title}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={toggle}
          className="flex w-full items-center justify-center rounded-md p-2 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors"
        >
          {isOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
