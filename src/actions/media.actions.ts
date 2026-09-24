"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/session";
import { mediaService } from "@/services/media.service";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { ALL_ALLOWED_TYPES, MAX_FILE_SIZE } from "@/lib/validations/media";
import { parseSearchParams, type ActionState } from "@/lib/cms";

export async function getMedia(searchParams: Record<string, string | string[] | undefined>) {
  await requirePermission("media.view");
  const params = parseSearchParams(searchParams);
  const folder = typeof searchParams.folder === "string" ? searchParams.folder : undefined;
  const mimeType = typeof searchParams.type === "string" ? searchParams.type : undefined;
  const extraFilter: Record<string, unknown> = {};
  if (folder) extraFilter.folder = folder;
  if (mimeType) extraFilter.mimeType = { $regex: `^${mimeType}` };
  const result = await mediaService.findPaginated(params, extraFilter);
  return JSON.parse(JSON.stringify(result));
}

export async function uploadMedia(formData: FormData): Promise<ActionState & { id?: string; url?: string }> {
  const session = await requirePermission("media.upload");
  const file = formData.get("file") as File | null;
  if (!file) return { error: "No file provided" };

  if (!ALL_ALLOWED_TYPES.includes(file.type)) {
    return { error: "File type not allowed" };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { error: "File exceeds 10MB limit" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const resourceType = file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : "raw";
  const folder = (formData.get("folder") as string) || "school-cms";

  const result = await uploadToCloudinary(buffer, { folder, resourceType });

  const media = await mediaService.create({
    filename: `${result.publicId}.${result.format}`,
    originalName: file.name,
    url: result.secureUrl,
    publicId: result.publicId,
    mimeType: file.type,
    size: result.size,
    width: result.width,
    height: result.height,
    folder,
    alt: (formData.get("alt") as string) || undefined,
    caption: (formData.get("caption") as string) || undefined,
    tags: formData.get("tags") ? (formData.get("tags") as string).split(",").map((t) => t.trim()) : [],
    uploadedBy: session.user.id,
  } as never);

  revalidatePath("/admin/media");
  return { success: "File uploaded", id: media._id.toString(), url: media.url };
}

export async function updateMedia(id: string, data: { alt?: string; caption?: string; folder?: string; tags?: string[] }): Promise<ActionState> {
  await requirePermission("media.update");
  await mediaService.update(id, data as never);
  revalidatePath("/admin/media");
  return { success: "Media updated" };
}

export async function deleteMedia(id: string): Promise<ActionState> {
  await requirePermission("media.delete");
  const media = await mediaService.findById(id);
  if (!media) return { error: "Media not found" };

  await deleteFromCloudinary(media.publicId, media.mimeType.startsWith("video") ? "video" : media.mimeType.startsWith("image") ? "image" : "raw");
  await mediaService.delete(id);
  revalidatePath("/admin/media");
  return { success: "Media deleted" };
}

export async function getMediaFolders() {
  await requirePermission("media.view");
  const folders = await mediaService.getFolders();
  return JSON.parse(JSON.stringify(folders));
}
