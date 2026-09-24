"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/session";
import { userService } from "@/services/user.service";
import { createUserSchema, updateUserSchema } from "@/lib/validations/users";
import { parseSearchParams, type ActionState } from "@/lib/cms";
import { connectDB } from "@/lib/db";
import { Role } from "@/models/role.model";

export async function getUsers(searchParams: Record<string, string | string[] | undefined>) {
  await requirePermission("users.view");
  const params = parseSearchParams(searchParams);
  const roleFilter = typeof searchParams.role === "string" ? searchParams.role : undefined;
  const extraFilter: Record<string, unknown> = {};
  if (roleFilter) extraFilter.role = roleFilter;
  const result = await userService.findPaginated(params, extraFilter);
  return JSON.parse(JSON.stringify(result));
}

export async function getUserById(id: string) {
  await requirePermission("users.view");
  const result = await userService.findById(id);
  return JSON.parse(JSON.stringify(result));
}

export async function getRoles() {
  await requirePermission("users.view");
  await connectDB();
  const roles = await Role.find({}).sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(roles)) as {
    _id: string;
    name: string;
    slug: string;
    description?: string;
  }[];
}

export async function createUser(data: unknown): Promise<ActionState & { id?: string }> {
  await requirePermission("users.create");
  const parsed = createUserSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };

  try {
    const user = await userService.createUser(parsed.data);
    revalidatePath("/admin/users");
    return { success: "User created", id: user._id.toString() };
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate")) {
      return { error: "A user with this email already exists" };
    }
    return { error: "Failed to create user" };
  }
}

export async function updateUser(data: unknown): Promise<ActionState> {
  await requirePermission("users.update");
  const parsed = updateUserSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };

  const { id, ...updateData } = parsed.data;
  try {
    await userService.updateUser(id, updateData);
    revalidatePath("/admin/users");
    return { success: "User updated" };
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate")) {
      return { error: "A user with this email already exists" };
    }
    return { error: "Failed to update user" };
  }
}

export async function deleteUser(id: string): Promise<ActionState> {
  const session = await requirePermission("users.delete");

  // Prevent self-deletion
  if (session.user.id === id) {
    return { error: "You cannot delete your own account" };
  }

  await userService.hardDelete(id);
  revalidatePath("/admin/users");
  return { success: "User deleted" };
}

export async function toggleUserActive(id: string): Promise<ActionState> {
  const session = await requirePermission("users.update");

  // Prevent self-deactivation
  if (session.user.id === id) {
    return { error: "You cannot deactivate your own account" };
  }

  await userService.toggleActive(id);
  revalidatePath("/admin/users");
  return { success: "User status updated" };
}
