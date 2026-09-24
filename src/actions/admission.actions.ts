"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/session";
import { admissionService } from "@/services/admission.service";
import { createAdmissionSchema, updateAdmissionSchema } from "@/lib/validations/admissions";
import { parseSearchParams, type ActionState } from "@/lib/cms";

export async function getAdmissions(searchParams: Record<string, string | string[] | undefined>) {
  await requirePermission("admissions.view");
  return admissionService.findPaginated(parseSearchParams(searchParams));
}

export async function getAdmissionById(id: string) {
  await requirePermission("admissions.view");
  return admissionService.findById(id);
}

export async function createAdmission(data: unknown): Promise<ActionState & { id?: string }> {
  const session = await requirePermission("admissions.create");
  const parsed = createAdmissionSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };
  const slug = await admissionService.generateUniqueSlug(parsed.data.title);
  const doc = await admissionService.create({ ...parsed.data, slug: parsed.data.slug || slug, createdBy: session.user.id, updatedBy: session.user.id } as never);
  revalidatePath("/admin/admissions");
  revalidatePath("/admissions");
  return { success: "Admission content created", id: doc._id.toString() };
}

export async function updateAdmission(data: unknown): Promise<ActionState> {
  const session = await requirePermission("admissions.update");
  const parsed = updateAdmissionSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };
  const { id, ...updateData } = parsed.data;
  await admissionService.update(id, { ...updateData, updatedBy: session.user.id } as never);
  revalidatePath("/admin/admissions");
  revalidatePath("/admissions");
  return { success: "Admission content updated" };
}

export async function publishAdmission(id: string): Promise<ActionState> {
  const session = await requirePermission("admissions.publish");
  await admissionService.publish(id, session.user.id);
  revalidatePath("/admin/admissions");
  revalidatePath("/admissions");
  return { success: "Published" };
}

export async function deleteAdmission(id: string): Promise<ActionState> {
  const session = await requirePermission("admissions.delete");
  await admissionService.softDelete(id, session.user.id);
  revalidatePath("/admin/admissions");
  revalidatePath("/admissions");
  revalidatePath("/", "layout");
  return { success: "Deleted" };
}
