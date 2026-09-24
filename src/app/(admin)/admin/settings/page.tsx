import { requirePermission } from "@/lib/auth/session";
import { getAllSettings } from "@/actions/settings.actions";
import { siteSettingService } from "@/services/settings.service";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { SettingsManager } from "@/features/settings/components/settings-manager";

export const metadata = { title: "Site Settings | School CMS" };

export default async function AdminSettingsPage() {
  await requirePermission("settings.view");
  const settings = await getAllSettings();
  const groups = await siteSettingService.getAllGroups();

  // Ensure default groups exist
  const allGroups = Array.from(new Set(["general", "contact", "social", "branding", ...groups]));

  return (
    <AdminPageLayout>
      <PageHeader title="Site Settings" description="Manage global site configuration, contact info, branding, and social links" />
      <SettingsManager settings={JSON.parse(JSON.stringify(settings))} groups={allGroups} />
    </AdminPageLayout>
  );
}
