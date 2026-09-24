"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/session";
import { tcService } from "@/services/tc.service";
import { createTCSchema, updateTCSchema, tcSearchSchema } from "@/lib/validations/tc";
import { parseSearchParams, type ActionState } from "@/lib/cms";

export async function getTCs(searchParams: Record<string, string | string[] | undefined>) {
  await requirePermission("tc.view");
  return tcService.findPaginated(parseSearchParams(searchParams));
}

export async function getTCById(id: string) {
  await requirePermission("tc.view");
  return tcService.findById(id);
}

export async function createTC(data: unknown): Promise<ActionState & { id?: string }> {
  const session = await requirePermission("tc.create");
  const parsed = createTCSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };
  const doc = await tcService.create({ ...parsed.data, createdBy: session.user.id, updatedBy: session.user.id } as never);
  revalidatePath("/admin/tc");
  revalidatePath("/tc-tracker");
  return { success: "Transfer certificate issued", id: doc._id.toString() };
}

export async function updateTC(data: unknown): Promise<ActionState> {
  const session = await requirePermission("tc.update");
  const parsed = updateTCSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };
  const { id, ...updateData } = parsed.data;
  await tcService.update(id, { ...updateData, updatedBy: session.user.id } as never);
  revalidatePath("/admin/tc");
  revalidatePath("/tc-tracker");
  return { success: "Transfer certificate updated" };
}

export async function deleteTC(id: string): Promise<ActionState> {
  const session = await requirePermission("tc.delete");
  await tcService.softDelete(id, session.user.id);
  revalidatePath("/admin/tc");
  revalidatePath("/tc-tracker");
  return { success: "Transfer certificate deleted" };
}

export async function verifyTC(data: unknown) {
  const parsed = tcSearchSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  const tc = await tcService.verifyAndGetTC(parsed.data.admissionNumber, new Date(parsed.data.dateOfBirth));
  if (!tc) return { error: "No active Transfer Certificate found matching the provided details." };
  return { success: "Transfer certificate found", data: JSON.parse(JSON.stringify(tc)) };
}
