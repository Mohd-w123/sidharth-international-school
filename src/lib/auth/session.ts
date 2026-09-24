import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Permission } from "@/lib/auth/permissions";

export async function getSession() {
  return await auth();
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

export async function requirePermission(...permissions: Permission[]) {
  const session = await requireAuth();
  const userPermissions = session.user.permissions ?? [];
  const hasPermission = permissions.every((p) => userPermissions.includes(p));
  if (!hasPermission) {
    redirect("/admin/unauthorized");
  }
  return session;
}

export function hasPermission(
  userPermissions: string[],
  ...required: Permission[]
): boolean {
  return required.every((p) => userPermissions.includes(p));
}

export function hasAnyPermission(
  userPermissions: string[],
  ...required: Permission[]
): boolean {
  return required.some((p) => userPermissions.includes(p));
}
