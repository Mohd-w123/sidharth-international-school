import type { Permission } from "@/lib/auth/permissions";
import {
  LayoutDashboard,
  FileText,
  Home,
  Menu,
  Image,
  Newspaper,
  Calendar,
  Images,
  Users,
  GraduationCap,
  ClipboardList,
  Shield,
  BarChart3,
  FileCheck,
  FormInput,
  Settings,
  ScrollText,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  permission?: Permission;
  badge?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const adminNavigation: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "Content",
    items: [
      { title: "Pages", href: "/admin/pages", icon: FileText, permission: "pages.view" },
      { title: "Homepage", href: "/admin/homepage", icon: Home, permission: "homepage.view" },
      { title: "Menus", href: "/admin/menus", icon: Menu, permission: "menus.view" },
      { title: "Media", href: "/admin/media", icon: Image, permission: "media.view" },
    ],
  },
  {
    title: "Communications",
    items: [
      { title: "News", href: "/admin/news", icon: Newspaper, permission: "news.view" },
      { title: "Events", href: "/admin/events", icon: Calendar, permission: "events.view" },
      { title: "Gallery", href: "/admin/gallery", icon: Images, permission: "gallery.view" },
    ],
  },
  // {
  //   title: "Academics",
  //   items: [
  //     { title: "Faculty", href: "/admin/faculty", icon: Users, permission: "faculty.view" },
  //     { title: "Programs", href: "/admin/academics", icon: GraduationCap, permission: "academics.view" },
  //     { title: "Admissions", href: "/admin/admissions", icon: ClipboardList, permission: "admissions.view" },
  //     { title: "Results", href: "/admin/results", icon: BarChart3, permission: "results.view" },
  //     { title: "Transfer Certs", href: "/admin/tc", icon: FileCheck, permission: "tc.view" },
  //   ],
  // },
  {
    title: "Compliance",
    items: [
      { title: "Disclosure", href: "/admin/disclosure", icon: Shield, permission: "disclosure.view" },
      { title: "Forms", href: "/admin/forms", icon: FormInput, permission: "forms.view" },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Users", href: "/admin/users", icon: Users, permission: "users.view" },
      { title: "Audit Log", href: "/admin/audit-logs", icon: ScrollText, permission: "audit.view" },
      { title: "Settings", href: "/admin/settings", icon: Settings, permission: "settings.view" },
    ],
  },
];
