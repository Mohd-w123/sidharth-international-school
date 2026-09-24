import type { ServiceResult } from "./base-service";

export function success<T>(data: T): ServiceResult<T> {
  return { success: true, data };
}

export function failure<T = never>(error: string): ServiceResult<T> {
  return { success: false, error };
}

export interface ActionState {
  error?: string;
  success?: string;
}

export function parseFormId(formData: FormData, key = "id"): string {
  const id = formData.get(key);
  if (!id || typeof id !== "string") throw new Error(`Missing ${key}`);
  return id;
}

export function parseSearchParams(searchParams: Record<string, string | string[] | undefined>) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.limit) || 20));
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
  const status = typeof searchParams.status === "string" ? searchParams.status : undefined;
  const sortField = typeof searchParams.sortField === "string" ? searchParams.sortField : "createdAt";
  const sortOrder = searchParams.sortOrder === "asc" ? ("asc" as const) : ("desc" as const);

  return {
    search,
    status,
    pagination: { page, limit },
    sort: { field: sortField, order: sortOrder },
  };
}
