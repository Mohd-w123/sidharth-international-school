import { requireAuth } from "@/lib/auth/session";
import { getDashboardStats } from "@/actions/dashboard.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { StatsCard } from "@/features/admin/components/stats-card";
import {
  FileText,
  Newspaper,
  Calendar,
  Images,
  Users,
  Image,
  GraduationCap,
  ClipboardList,
} from "lucide-react";

export const metadata = {
  title: "Dashboard | School CMS",
};

export default async function AdminDashboardPage() {
  const session = await requireAuth();
  const stats = await getDashboardStats();

  const cards = [
    { title: "Pages", value: stats.pages, icon: FileText, href: "/admin/pages" },
    { title: "News Articles", value: stats.news, icon: Newspaper, href: "/admin/news" },
    { title: "Events", value: stats.events, icon: Calendar, href: "/admin/events" },
    { title: "Gallery Albums", value: stats.gallery, icon: Images, href: "/admin/gallery" },
    { title: "Faculty Members", value: stats.faculty, icon: GraduationCap, href: "/admin/faculty" },
    { title: "Users", value: stats.users, icon: Users, href: "/admin/users" },
    { title: "Media Files", value: stats.media, icon: Image, href: "/admin/media" },
    { title: "Form Submissions", value: stats.submissions, icon: ClipboardList, href: "/admin/forms" },
  ];

  return (
    <AdminPageLayout>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${session.user.name}`}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <StatsCard key={card.title} {...card} />
        ))}
      </div>
    </AdminPageLayout>
  );
}
