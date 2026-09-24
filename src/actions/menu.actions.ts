"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/session";
import { menuService } from "@/services/menu.service";
import { createMenuSchema, updateMenuSchema } from "@/lib/validations/menu";
import type { ActionState } from "@/lib/cms";

export async function getMenus() {
  await requirePermission("menus.view");
  return menuService.findAll();
}

export async function getMenuById(id: string) {
  await requirePermission("menus.view");
  return menuService.findById(id);
}

export async function getMenuByLocation(location: "header" | "footer" | "secondary") {
  return menuService.findByLocation(location);
}

export async function createMenu(data: unknown): Promise<ActionState & { id?: string }> {
  const session = await requirePermission("menus.create");
  const parsed = createMenuSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };

  const menu = await menuService.create({
    ...parsed.data,
    createdBy: session.user.id,
    updatedBy: session.user.id,
  } as never);

  revalidatePath("/admin/menus");
  revalidatePath("/", "layout");
  revalidatePath("/");
  return { success: "Menu created", id: menu._id.toString() };
}

export async function updateMenu(data: unknown): Promise<ActionState> {
  const session = await requirePermission("menus.update");
  const parsed = updateMenuSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };

  const { id, ...updateData } = parsed.data;
  await menuService.update(id, { ...updateData, updatedBy: session.user.id } as never);
  revalidatePath("/admin/menus");
  revalidatePath("/", "layout");
  revalidatePath("/");
  return { success: "Menu updated" };
}

export async function deleteMenu(id: string): Promise<ActionState> {
  await requirePermission("menus.delete");
  await menuService.delete(id);
  revalidatePath("/admin/menus");
  revalidatePath("/", "layout");
  revalidatePath("/");
  return { success: "Menu deleted" };
}
