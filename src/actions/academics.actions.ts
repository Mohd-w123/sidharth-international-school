"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/session";
import { programService, classService, subjectService, calendarService } from "@/services/academics.service";
import { createProgramSchema, updateProgramSchema, createClassSchema, updateClassSchema, createSubjectSchema, updateSubjectSchema, createCalendarEventSchema, updateCalendarEventSchema } from "@/lib/validations/academics";
import { parseSearchParams, type ActionState } from "@/lib/cms";

// Programs
export async function getPrograms(searchParams: Record<string, string | string[] | undefined>) {
  await requirePermission("academics.view");
  return programService.findPaginated(parseSearchParams(searchParams));
}

export async function getProgramById(id: string) {
  await requirePermission("academics.view");
  return programService.findById(id);
}

export async function createProgram(data: unknown): Promise<ActionState & { id?: string }> {
  const session = await requirePermission("academics.create");
  const parsed = createProgramSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };
  const slug = await programService.generateUniqueSlug(parsed.data.name);
  const doc = await programService.create({ ...parsed.data, slug: parsed.data.slug || slug, createdBy: session.user.id, updatedBy: session.user.id } as never);
  revalidatePath("/admin/academics");
  revalidatePath("/academics");
  return { success: "Program created", id: doc._id.toString() };
}

export async function updateProgram(data: unknown): Promise<ActionState> {
  const session = await requirePermission("academics.update");
  const parsed = updateProgramSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };
  const { id, ...updateData } = parsed.data;
  await programService.update(id, { ...updateData, updatedBy: session.user.id } as never);
  revalidatePath("/admin/academics");
  revalidatePath("/academics");
  return { success: "Program updated" };
}

export async function deleteProgram(id: string): Promise<ActionState> {
  const session = await requirePermission("academics.delete");
  await programService.softDelete(id, session.user.id);
  revalidatePath("/admin/academics");
  revalidatePath("/academics");
  revalidatePath("/", "layout");
  return { success: "Program deleted" };
}

// Classes
export async function getClasses(searchParams: Record<string, string | string[] | undefined>) {
  await requirePermission("academics.view");
  return classService.findPaginated(parseSearchParams(searchParams));
}

export async function createClass(data: unknown): Promise<ActionState> {
  const session = await requirePermission("academics.create");
  const parsed = createClassSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };
  const slug = await classService.generateUniqueSlug(parsed.data.name);
  await classService.create({ ...parsed.data, slug: parsed.data.slug || slug, createdBy: session.user.id, updatedBy: session.user.id } as never);
  revalidatePath("/admin/academics");
  revalidatePath("/academics");
  revalidatePath("/", "layout");
  return { success: "Class created" };
}

export async function updateClass(data: unknown): Promise<ActionState> {
  const session = await requirePermission("academics.update");
  const parsed = updateClassSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };
  const { id, ...updateData } = parsed.data;
  await classService.update(id, { ...updateData, updatedBy: session.user.id } as never);
  revalidatePath("/admin/academics");
  revalidatePath("/academics");
  revalidatePath("/", "layout");
  return { success: "Class updated" };
}

export async function deleteClass(id: string): Promise<ActionState> {
  const session = await requirePermission("academics.delete");
  await classService.softDelete(id, session.user.id);
  revalidatePath("/admin/academics");
  revalidatePath("/academics");
  revalidatePath("/", "layout");
  return { success: "Class deleted" };
}

// Subjects
export async function getSubjects(searchParams: Record<string, string | string[] | undefined>) {
  await requirePermission("academics.view");
  return subjectService.findPaginated(parseSearchParams(searchParams));
}

export async function createSubject(data: unknown): Promise<ActionState> {
  const session = await requirePermission("academics.create");
  const parsed = createSubjectSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };
  const slug = await subjectService.generateUniqueSlug(parsed.data.name);
  await subjectService.create({ ...parsed.data, slug: parsed.data.slug || slug, createdBy: session.user.id, updatedBy: session.user.id } as never);
  revalidatePath("/admin/academics");
  revalidatePath("/academics");
  revalidatePath("/", "layout");
  return { success: "Subject created" };
}

export async function updateSubject(data: unknown): Promise<ActionState> {
  const session = await requirePermission("academics.update");
  const parsed = updateSubjectSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };
  const { id, ...updateData } = parsed.data;
  await subjectService.update(id, { ...updateData, updatedBy: session.user.id } as never);
  revalidatePath("/admin/academics");
  revalidatePath("/academics");
  revalidatePath("/", "layout");
  return { success: "Subject updated" };
}

export async function deleteSubject(id: string): Promise<ActionState> {
  const session = await requirePermission("academics.delete");
  await subjectService.softDelete(id, session.user.id);
  revalidatePath("/admin/academics");
  revalidatePath("/academics");
  revalidatePath("/", "layout");
  return { success: "Subject deleted" };
}

// Calendar
export async function getCalendarEvents(searchParams: Record<string, string | string[] | undefined>) {
  await requirePermission("academics.view");
  const session_filter = typeof searchParams.session === "string" ? searchParams.session : undefined;
  const extraFilter: Record<string, unknown> = {};
  if (session_filter) extraFilter.session = session_filter;
  return calendarService.findPaginated(parseSearchParams(searchParams), extraFilter);
}

export async function createCalendarEvent(data: unknown): Promise<ActionState> {
  const session = await requirePermission("academics.create");
  const parsed = createCalendarEventSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };
  await calendarService.create({ ...parsed.data, createdBy: session.user.id, updatedBy: session.user.id } as never);
  revalidatePath("/admin/academics");
  revalidatePath("/academics");
  revalidatePath("/", "layout");
  return { success: "Calendar event created" };
}

export async function updateCalendarEvent(data: unknown): Promise<ActionState> {
  const session = await requirePermission("academics.update");
  const parsed = updateCalendarEventSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };
  const { id, ...updateData } = parsed.data;
  await calendarService.update(id, { ...updateData, updatedBy: session.user.id } as never);
  revalidatePath("/admin/academics");
  revalidatePath("/academics");
  revalidatePath("/", "layout");
  return { success: "Calendar event updated" };
}

export async function deleteCalendarEvent(id: string): Promise<ActionState> {
  const session = await requirePermission("academics.delete");
  await calendarService.hardDelete(id);
  revalidatePath("/admin/academics");
  revalidatePath("/academics");
  revalidatePath("/", "layout");
  return { success: "Calendar event deleted" };
}
