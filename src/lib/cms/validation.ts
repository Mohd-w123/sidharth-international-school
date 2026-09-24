import { z } from "zod";

export const contentStatusSchema = z.enum(["draft", "published", "archived"]);
export type ContentStatus = z.infer<typeof contentStatusSchema>;

export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens");

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const sortSchema = z.object({
  field: z.string().default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const querySchema = z.object({
  search: z.string().optional(),
  status: z.union([contentStatusSchema, z.literal("all")]).optional(),
  pagination: paginationSchema.optional(),
  sort: sortSchema.optional(),
});

export const idSchema = z.string().min(1, "ID is required");

export const bulkIdsSchema = z.object({
  ids: z.array(idSchema).min(1, "Select at least one item"),
});

export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: idSchema,
      order: z.number().int().min(0),
    })
  ),
});

export const seoSchema = z.object({
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  seoKeywords: z.array(z.string()).optional(),
});
