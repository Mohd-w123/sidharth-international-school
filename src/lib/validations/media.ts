import { z } from "zod";

export const uploadMediaSchema = z.object({
  folder: z.string().optional(),
  alt: z.string().max(200).optional(),
  caption: z.string().max(500).optional(),
  tags: z.array(z.string()).default([]),
});

export const updateMediaSchema = z.object({
  id: z.string().min(1),
  alt: z.string().max(200).optional(),
  caption: z.string().max(500).optional(),
  folder: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
export const ALLOWED_DOCUMENT_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
export const ALL_ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES, ...ALLOWED_VIDEO_TYPES];
export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export type UploadMediaInput = z.infer<typeof uploadMediaSchema>;
export type UpdateMediaInput = z.infer<typeof updateMediaSchema>;
