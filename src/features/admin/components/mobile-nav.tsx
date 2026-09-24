"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/features/admin/context/sidebar-context";
import { adminNavigation, type NavItem } from "@/features/admin/config/navigation";
import { X } from "lucide-react";

interface MobileNavProps {
  permissions: string[];
}

export function MobileNav({ permissions }: MobileNavProps) {
  const pathname = usePathname();
  const { isMobileOpen, closeMobile } = useSidebar();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const canView = (item: NavItem) => {
    if (!item.permission) return true;
    return permissions.includes(item.permission);
  };

  if (!isMobileOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={closeMobile}
      />

      {/* Drawer */}
      <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-sidebar text-sidebar-foreground lg:hidden flex flex-col animate-in slide-in-from-left duration-300">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <Link href="/admin" className="flex items-center gap-2" onClick={closeMobile}>
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="text-sm font-bold text-sidebar-primary-foreground">S</span>
            </div>
            <span className="font-heading font-semibold text-sm">School CMS</span>
          </Link>
          <button
            onClick={closeMobile}
            className="p-1.5 rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {adminNavigation.map((group) => {
            const visibleItems = group.items.filter(canView);
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title} className="mb-4">
                <p className="px-3 mb-1 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/50">
                  {group.title}
                </p>
                <ul className="space-y-0.5">
                  {visibleItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeMobile}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                          isActive(item.href)
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
