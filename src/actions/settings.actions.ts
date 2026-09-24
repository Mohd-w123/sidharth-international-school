"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/session";
import { siteSettingService } from "@/services/settings.service";
import { updateSettingSchema, updateSettingsBatchSchema } from "@/lib/validations/settings";
import type { ActionState } from "@/lib/cms";

export async function getAllSettings() {
  await requirePermission("settings.view");
  const settings = await siteSettingService.getAll();
  return JSON.parse(JSON.stringify(settings));
}

export async function getSettingsByGroup(group: string) {
  await requirePermission("settings.view");
  const settings = await siteSettingService.getByGroup(group);
  return JSON.parse(JSON.stringify(settings));
}

export async function updateSetting(data: unknown): Promise<ActionState> {
  const session = await requirePermission("settings.update");
  const parsed = updateSettingSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };

  await siteSettingService.upsert(parsed.data.key, parsed.data.value, session.user.id);
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { success: "Setting updated" };
}

export async function updateSettingsBatch(data: unknown): Promise<ActionState> {
  const session = await requirePermission("settings.update");
  const parsed = updateSettingsBatchSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };

  for (const setting of parsed.data.settings) {
    await siteSettingService.upsert(setting.key, setting.value, session.user.id);
  }

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { success: `${parsed.data.settings.length} settings updated` };
}

export async function createSetting(data: { key: string; value: unknown; group: string; label: string; type: string }): Promise<ActionState> {
  const session = await requirePermission("settings.update");
  await siteSettingService.upsert(data.key, data.value, session.user.id, {
    group: data.group,
    label: data.label,
    type: data.type as "text",
  });
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { success: "Setting created" };
}
