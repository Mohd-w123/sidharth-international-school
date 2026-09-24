"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/session";
import { galleryService } from "@/services/gallery.service";
import {
  createAlbumSchema,
  updateAlbumSchema,
  createGalleryItemSchema,
} from "@/lib/validations/gallery";
import { parseSearchParams, type ActionState } from "@/lib/cms";

export async function getAlbums(
  searchParams: Record<string, string | string[] | undefined>
) {
  await requirePermission("gallery.view");
  const params = parseSearchParams(searchParams);
  const type =
    typeof searchParams.type === "string" ? searchParams.type : undefined;
  const extraFilter: Record<string, unknown> = {};
  if (type && (type === "photo" || type === "video")) extraFilter.type = type;
  return galleryService.findPaginated(params, extraFilter);
}

export async function getAlbumById(id: string) {
  await requirePermission("gallery.view");
  return galleryService.findById(id);
}

export async function createAlbum(
  data: unknown
): Promise<ActionState & { id?: string }> {
  const session = await requirePermission("gallery.create");
  const parsed = createAlbumSchema.safeParse(data);
  if (!parsed.success)
    return { error: parsed.error.errors[0]?.message ?? "Invalid data" };

  const slug = await galleryService.generateUniqueSlug(parsed.data.title);
  const album = await galleryService.create({
    ...parsed.data,
    slug: parsed.data.slug || slug,
    createdBy: session.user.id,
    updatedBy: session.user.id,
  } as never);

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: "Album created", id: album._id.toString() };
}

export async function updateAlbum(data: unknown): Promise<ActionState> {
  const session = await requirePermission("gallery.update");
  const parsed = updateAlbumSchema.safeParse(data);
  if (!parsed.success)
    return { error: parsed.error.errors[0]?.message ?? "Invalid data" };

  const { id, ...updateData } = parsed.data;
  await galleryService.update(id, {
    ...updateData,
    updatedBy: session.user.id,
  } as never);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: "Album updated" };
}

export async function publishAlbum(id: string): Promise<ActionState> {
  const session = await requirePermission("gallery.publish");
  await galleryService.publish(id, session.user.id);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: "Album published" };
}

export async function unpublishAlbum(id: string): Promise<ActionState> {
  const session = await requirePermission("gallery.publish");
  await galleryService.unpublish(id, session.user.id);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: "Album unpublished" };
}

export async function deleteAlbum(id: string): Promise<ActionState> {
  const session = await requirePermission("gallery.delete");
  await galleryService.softDelete(id, session.user.id);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: "Album deleted" };
}

// Gallery Item Actions
export async function getGalleryItems(albumId: string) {
  await requirePermission("gallery.view");
  return galleryService.getItems(albumId);
}

export async function addGalleryItem(
  data: unknown
): Promise<ActionState & { id?: string }> {
  const session = await requirePermission("gallery.create");
  const parsed = createGalleryItemSchema.safeParse(data);
  if (!parsed.success)
    return { error: parsed.error.errors[0]?.message ?? "Invalid data" };

  const item = await galleryService.addItem({
    album: parsed.data.albumId,
    url: parsed.data.url,
    thumbnailUrl: parsed.data.thumbnailUrl,
    title: parsed.data.title,
    caption: parsed.data.caption,
    type: parsed.data.type,
    order: parsed.data.order,
  } as never);

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return {
    success: "Item added",
    id: item._id.toString(),
  };
}

export async function removeGalleryItem(id: string): Promise<ActionState> {
  await requirePermission("gallery.delete");
  await galleryService.removeItem(id);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: "Item removed" };
}

export async function reorderGalleryItems(
  items: { id: string; order: number }[]
): Promise<ActionState> {
  await requirePermission("gallery.update");
  await galleryService.reorderItems(items);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/", "layout");
  return { success: "Items reordered" };
}
