"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/session";
import { pageService } from "@/services/page.service";
import { createPageSchema, updatePageSchema } from "@/lib/validations/page";
import { parseSearchParams, type ActionState } from "@/lib/cms";

export async function getPages(searchParams: Record<string, string | string[] | undefined>) {
  await requirePermission("pages.view");
  const params = parseSearchParams(searchParams);
  return pageService.findPaginated(params);
}

export async function getPageById(id: string) {
  await requirePermission("pages.view");
  return pageService.findById(id);
}

export async function createPage(data: unknown): Promise<ActionState & { id?: string }> {
  const session = await requirePermission("pages.create");
  const parsed = createPageSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };

  const slug = await pageService.generateUniqueSlug(parsed.data.title);
  const page = await pageService.create({
    ...parsed.data,
    slug: parsed.data.slug || slug,
    createdBy: session.user.id,
    updatedBy: session.user.id,
  } as never);

  revalidatePath("/admin/pages");
  return { success: "Page created", id: page._id.toString() };
}

export async function updatePage(data: unknown): Promise<ActionState> {
  const session = await requirePermission("pages.update");
  const parsed = updatePageSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };

  const { id, ...updateData } = parsed.data;
  const page = await pageService.update(id, { ...updateData, updatedBy: session.user.id } as never);
  revalidatePath("/admin/pages");
  revalidatePath("/", "layout");
  if (page?.slug) {
    revalidatePath(`/${page.slug}`);
  }
  return { success: "Page updated" };
}

export async function publishPage(id: string): Promise<ActionState> {
  const session = await requirePermission("pages.publish");
  const page = await pageService.publish(id, session.user.id);
  revalidatePath("/admin/pages");
  revalidatePath("/", "layout");
  if (page?.slug) {
    revalidatePath(`/${page.slug}`);
  }
  return { success: "Page published" };
}

export async function unpublishPage(id: string): Promise<ActionState> {
  const session = await requirePermission("pages.publish");
  const page = await pageService.unpublish(id, session.user.id);
  revalidatePath("/admin/pages");
  revalidatePath("/", "layout");
  if (page?.slug) {
    revalidatePath(`/${page.slug}`);
  }
  return { success: "Page unpublished" };
}

export async function deletePage(id: string): Promise<ActionState> {
  const session = await requirePermission("pages.delete");
  const existing = await pageService.findById(id);
  await pageService.softDelete(id, session.user.id);
  revalidatePath("/admin/pages");
  revalidatePath("/", "layout");
  if (existing?.slug) {
    revalidatePath(`/${existing.slug}`);
  }
  return { success: "Page deleted" };
}

export async function bulkDeletePages(ids: string[]): Promise<ActionState> {
  const session = await requirePermission("pages.delete");
  await pageService.bulkDelete(ids, session.user.id);
  revalidatePath("/admin/pages");
  revalidatePath("/", "layout");
  return { success: `${ids.length} page(s) deleted` };
}

export async function duplicatePage(id: string): Promise<ActionState & { id?: string }> {
  try {
    const session = await requirePermission("pages.create");
    const existing = await pageService.findById(id);
    if (!existing) return { error: "Page not found" };

    const newTitle = `${existing.title} (Copy)`;
    const slug = await pageService.generateUniqueSlug(newTitle);

    const blocks = (existing.blocks || []).map((b, idx) => ({
      type: b.type,
      content: JSON.parse(JSON.stringify(b.content || {})),
      order: idx,
    }));

    const page = await pageService.create({
      title: newTitle,
      slug,
      description: existing.description,
      banner: existing.banner,
      blocks,
      status: "draft",
      template: existing.template,
      seoTitle: existing.seoTitle ? `${existing.seoTitle} (Copy)` : undefined,
      seoDescription: existing.seoDescription,
      seoKeywords: existing.seoKeywords ? [...existing.seoKeywords] : [],
      createdBy: session.user.id,
      updatedBy: session.user.id,
    } as never);

    revalidatePath("/admin/pages");
    return { success: `Page duplicated as "${newTitle}"`, id: page._id.toString() };
  } catch (err: any) {
    console.error("Duplicate page error:", err);
    return { error: err?.message || "Failed to duplicate page" };
  }
}

