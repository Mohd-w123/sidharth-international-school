"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/session";
import { facultyService } from "@/services/faculty.service";
import { createFacultySchema, updateFacultySchema } from "@/lib/validations/faculty";
import { parseSearchParams, type ActionState } from "@/lib/cms";

export async function getFaculty(searchParams: Record<string, string | string[] | undefined>) {
  await requirePermission("faculty.view");
  const params = parseSearchParams(searchParams);
  const department = typeof searchParams.department === "string" ? searchParams.department : undefined;
  const extraFilter: Record<string, unknown> = {};
  if (department) extraFilter.department = department;
  return facultyService.findPaginated(params, extraFilter);
}

export async function getFacultyById(id: string) {
  await requirePermission("faculty.view");
  return facultyService.findById(id);
}

export async function createFaculty(data: unknown): Promise<ActionState & { id?: string }> {
  const session = await requirePermission("faculty.create");
  const parsed = createFacultySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };

  const slug = await facultyService.generateUniqueSlug(parsed.data.name);
  const faculty = await facultyService.create({
    ...parsed.data,
    slug: parsed.data.slug || slug,
    createdBy: session.user.id,
    updatedBy: session.user.id,
  } as never);

  revalidatePath("/admin/faculty");
  revalidatePath("/faculty");
  return { success: "Faculty created", id: faculty._id.toString() };
}

export async function updateFaculty(data: unknown): Promise<ActionState> {
  const session = await requirePermission("faculty.update");
  const parsed = updateFacultySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };

  const { id, ...updateData } = parsed.data;
  await facultyService.update(id, { ...updateData, updatedBy: session.user.id } as never);
  revalidatePath("/admin/faculty");
  revalidatePath("/faculty");
  return { success: "Faculty updated" };
}

export async function deleteFaculty(id: string): Promise<ActionState> {
  const session = await requirePermission("faculty.delete");
  await facultyService.softDelete(id, session.user.id);
  revalidatePath("/admin/faculty");
  revalidatePath("/faculty");
  return { success: "Faculty deleted" };
}

export async function bulkDeleteFaculty(ids: string[]): Promise<ActionState> {
  const session = await requirePermission("faculty.delete");
  await facultyService.bulkDelete(ids, session.user.id);
  revalidatePath("/admin/faculty");
  revalidatePath("/faculty");
  return { success: `${ids.length} faculty deleted` };
}
