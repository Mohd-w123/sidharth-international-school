"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/session";
import { homepageService } from "@/services/homepage.service";
import { homepageConfigSchema, type HomepageSectionInput } from "@/lib/validations/homepage";
import type { ActionState } from "@/lib/cms";

export async function getHomepageConfig() {
  await requirePermission("homepage.view");
  return homepageService.getConfig();
}

export async function updateHomepageSections(sections: HomepageSectionInput[]): Promise<ActionState> {
  const session = await requirePermission("homepage.update");
  const parsed = homepageConfigSchema.shape.sections.safeParse(sections);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };

  await homepageService.updateSections(parsed.data, session.user.id);
  revalidatePath("/admin/homepage");
  revalidatePath("/", "layout");
  revalidatePath("/");
  return { success: "Sections updated" };
}

export async function publishHomepage(): Promise<ActionState> {
  const session = await requirePermission("homepage.publish");
  await homepageService.publish(session.user.id);
  revalidatePath("/admin/homepage");
  revalidatePath("/", "layout");
  revalidatePath("/");
  return { success: "Homepage published" };
}

export async function unpublishHomepage(): Promise<ActionState> {
  const session = await requirePermission("homepage.publish");
  await homepageService.unpublish(session.user.id);
  revalidatePath("/admin/homepage");
  revalidatePath("/", "layout");
  revalidatePath("/");
  return { success: "Homepage unpublished" };
}
