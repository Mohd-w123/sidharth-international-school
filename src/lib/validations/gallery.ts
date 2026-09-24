import { z } from "zod";
import { slugSchema, contentStatusSchema } from "@/lib/cms/validation";

export const createAlbumSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: slugSchema,
  description: z.string().max(500).optional(),
  coverImage: z.string().optional(),
  type: z.enum(["photo", "video"]).default("photo"),
  status: contentStatusSchema.default("draft"),
});

export const updateAlbumSchema = createAlbumSchema.partial().extend({
  id: z.string().min(1),
});

export const createGalleryItemSchema = z.object({
  albumId: z.string().min(1, "Album is required"),
  url: z.string().min(1, "URL is required"),
  thumbnailUrl: z.string().optional(),
  title: z.string().max(200).optional(),
  caption: z.string().max(500).optional(),
  type: z.enum(["image", "video"]).default("image"),
  order: z.number().int().min(0).default(0),
});

export const updateGalleryItemSchema = createGalleryItemSchema.partial().extend({
  id: z.string().min(1),
});

export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;
export type UpdateAlbumInput = z.infer<typeof updateAlbumSchema>;
export type CreateGalleryItemInput = z.infer<typeof createGalleryItemSchema>;
