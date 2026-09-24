"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/session";
import { resultService } from "@/services/result.service";
import { createResultSchema, updateResultSchema } from "@/lib/validations/results";
import { parseSearchParams, type ActionState } from "@/lib/cms";

export async function getResults(searchParams: Record<string, string | string[] | undefined>) {
  await requirePermission("results.view");
  const session_filter = typeof searchParams.session === "string" ? searchParams.session : undefined;
  const extra: Record<string, unknown> = {};
  if (session_filter) extra.session = session_filter;
  return resultService.findPaginated(parseSearchParams(searchParams), extra);
}

export async function getResultById(id: string) {
  await requirePermission("results.view");
  return resultService.findById(id);
}

export async function createResult(data: unknown): Promise<ActionState & { id?: string }> {
  const session = await requirePermission("results.create");
  const parsed = createResultSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };
  const slug = await resultService.generateUniqueSlug(parsed.data.title);
  const doc = await resultService.create({ ...parsed.data, slug: parsed.data.slug || slug, createdBy: session.user.id, updatedBy: session.user.id } as never);
  revalidatePath("/admin/results");
  revalidatePath("/results");
  return { success: "Result created", id: doc._id.toString() };
}

export async function updateResult(data: unknown): Promise<ActionState> {
  const session = await requirePermission("results.update");
  const parsed = updateResultSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };
  const { id, ...updateData } = parsed.data;
  await resultService.update(id, { ...updateData, updatedBy: session.user.id } as never);
  revalidatePath("/admin/results");
  revalidatePath("/results");
  return { success: "Result updated" };
}

export async function publishResult(id: string): Promise<ActionState> {
  const session = await requirePermission("results.publish");
  await resultService.publish(id, session.user.id);
  revalidatePath("/admin/results");
  revalidatePath("/results");
  return { success: "Published" };
}

export async function deleteResult(id: string): Promise<ActionState> {
  const session = await requirePermission("results.delete");
  await resultService.softDelete(id, session.user.id);
  revalidatePath("/admin/results");
  revalidatePath("/results");
  revalidatePath("/", "layout");
  return { success: "Deleted" };
}
