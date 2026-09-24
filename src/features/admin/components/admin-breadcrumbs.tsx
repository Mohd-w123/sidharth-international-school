"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { Fragment } from "react";

const ROUTE_LABELS: Record<string, string> = {
  admin: "Dashboard",
  pages: "Pages",
  homepage: "Homepage",
  menus: "Menus",
  media: "Media",
  news: "News",
  events: "Events",
  gallery: "Gallery",
  faculty: "Faculty",
  academics: "Academics",
  admissions: "Admissions",
  results: "Results",
  tc: "Transfer Certificates",
  disclosure: "Disclosure",
  forms: "Forms",
  users: "Users",
  audit: "Audit Log",
  settings: "Settings",
  create: "Create",
  edit: "Edit",
  unauthorized: "Unauthorized",
};

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = ROUTE_LABELS[segment] ?? segment.replace(/-/g, " ");
    const isLast = index === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-muted-foreground">
      <Link
        href="/admin"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {crumbs.slice(1).map((crumb) => (
        <Fragment key={crumb.href}>
          <ChevronRight className="mx-1.5 h-3.5 w-3.5 text-muted-foreground/50" />
          {crumb.isLast ? (
            <span className="font-medium text-foreground capitalize">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="hover:text-foreground transition-colors capitalize"
            >
              {crumb.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
