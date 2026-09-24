"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/session";
import { disclosureCategoryService, disclosureSectionService, disclosureTableService, disclosureDocumentService } from "@/services/disclosure.service";
import { createDisclosureCategorySchema, updateDisclosureCategorySchema, createDisclosureSectionSchema, updateDisclosureSectionSchema, createDisclosureTableSchema, updateDisclosureTableSchema, createDisclosureDocumentSchema, updateDisclosureDocumentSchema } from "@/lib/validations/disclosure";
import { parseSearchParams, type ActionState } from "@/lib/cms";

// Categories
export async function getDisclosureCategories(searchParams: Record<string, string | string[] | undefined>) {
  await requirePermission("disclosure.view");
  return disclosureCategoryService.findPaginated(parseSearchParams(searchParams));
}

export async function getDisclosureCategoryById(id: string) {
  await requirePermission("disclosure.view");
  return disclosureCategoryService.findById(id);
}

export async function createDisclosureCategory(data: unknown): Promise<ActionState & { id?: string }> {
  const session = await requirePermission("disclosure.create");
  const parsed = createDisclosureCategorySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };
  const slug = await disclosureCategoryService.generateUniqueSlug(parsed.data.name);
  const doc = await disclosureCategoryService.create({ ...parsed.data, slug: parsed.data.slug || slug, createdBy: session.user.id, updatedBy: session.user.id } as never);
  revalidatePath("/admin/disclosure");
  revalidatePath("/mandatory-disclosure");
  return { success: "Category created", id: doc._id.toString() };
}

export async function updateDisclosureCategory(data: unknown): Promise<ActionState> {
  const session = await requirePermission("disclosure.update");
  const parsed = updateDisclosureCategorySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };
  const { id, ...updateData } = parsed.data;
  await disclosureCategoryService.update(id, { ...updateData, updatedBy: session.user.id } as never);
  revalidatePath("/admin/disclosure");
  revalidatePath("/mandatory-disclosure");
  return { success: "Category updated" };
}

export async function publishDisclosureCategory(id: string): Promise<ActionState> {
  const session = await requirePermission("disclosure.update");
  await disclosureCategoryService.publish(id, session.user.id);
  revalidatePath("/admin/disclosure");
  revalidatePath("/mandatory-disclosure");
  return { success: "Published" };
}

export async function deleteDisclosureCategory(id: string): Promise<ActionState> {
  const session = await requirePermission("disclosure.delete");
  await disclosureCategoryService.softDelete(id, session.user.id);
  revalidatePath("/admin/disclosure");
  revalidatePath("/mandatory-disclosure");
  revalidatePath("/", "layout");
  return { success: "Deleted" };
}

// Sections
export async function getDisclosureSections(categoryId: string) {
  await requirePermission("disclosure.view");
  return disclosureSectionService.findByCategory(categoryId);
}

export async function createDisclosureSection(data: unknown): Promise<ActionState> {
  const session = await requirePermission("disclosure.create");
  const parsed = createDisclosureSectionSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };
  await disclosureSectionService.create({ ...parsed.data, createdBy: session.user.id, updatedBy: session.user.id } as never);
  revalidatePath("/admin/disclosure");
  revalidatePath("/mandatory-disclosure");
  revalidatePath("/", "layout");
  return { success: "Section created" };
}

export async function updateDisclosureSection(data: unknown): Promise<ActionState> {
  const session = await requirePermission("disclosure.update");
  const parsed = updateDisclosureSectionSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };
  const { id, ...updateData } = parsed.data;
  await disclosureSectionService.update(id, { ...updateData, updatedBy: session.user.id } as never);
  revalidatePath("/admin/disclosure");
  revalidatePath("/mandatory-disclosure");
  revalidatePath("/", "layout");
  return { success: "Section updated" };
}

export async function deleteDisclosureSection(id: string): Promise<ActionState> {
  await requirePermission("disclosure.delete");
  await disclosureSectionService.hardDelete(id);
  revalidatePath("/admin/disclosure");
  revalidatePath("/mandatory-disclosure");
  revalidatePath("/", "layout");
  return { success: "Section deleted" };
}

// Tables
export async function getDisclosureTables(sectionId: string) {
  await requirePermission("disclosure.view");
  return disclosureTableService.findBySection(sectionId);
}

export async function createDisclosureTable(data: unknown): Promise<ActionState> {
  const session = await requirePermission("disclosure.create");
  const parsed = createDisclosureTableSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };
  await disclosureTableService.create({ ...parsed.data, createdBy: session.user.id, updatedBy: session.user.id } as never);
  revalidatePath("/admin/disclosure");
  revalidatePath("/mandatory-disclosure");
  revalidatePath("/", "layout");
  return { success: "Table created" };
}

export async function updateDisclosureTable(data: unknown): Promise<ActionState> {
  const session = await requirePermission("disclosure.update");
  const parsed = updateDisclosureTableSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };
  const { id, ...updateData } = parsed.data;
  await disclosureTableService.update(id, { ...updateData, updatedBy: session.user.id } as never);
  revalidatePath("/admin/disclosure");
  revalidatePath("/mandatory-disclosure");
  revalidatePath("/", "layout");
  return { success: "Table updated" };
}

export async function deleteDisclosureTable(id: string): Promise<ActionState> {
  await requirePermission("disclosure.delete");
  await disclosureTableService.delete(id);
  revalidatePath("/admin/disclosure");
  revalidatePath("/mandatory-disclosure");
  revalidatePath("/", "layout");
  return { success: "Table deleted" };
}

// Documents
export async function getDisclosureDocuments(sectionId: string) {
  await requirePermission("disclosure.view");
  return disclosureDocumentService.findBySection(sectionId);
}

export async function createDisclosureDocument(data: unknown): Promise<ActionState> {
  const session = await requirePermission("disclosure.create");
  const parsed = createDisclosureDocumentSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };
  await disclosureDocumentService.create({ ...parsed.data, createdBy: session.user.id, updatedBy: session.user.id } as never);
  revalidatePath("/admin/disclosure");
  revalidatePath("/mandatory-disclosure");
  revalidatePath("/", "layout");
  return { success: "Document added" };
}

export async function deleteDisclosureDocument(id: string): Promise<ActionState> {
  await requirePermission("disclosure.delete");
  await disclosureDocumentService.delete(id);
  revalidatePath("/admin/disclosure");
  revalidatePath("/mandatory-disclosure");
  revalidatePath("/", "layout");
  return { success: "Document removed" };
}
