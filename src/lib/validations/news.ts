import { z } from "zod";
import { slugSchema, contentStatusSchema } from "@/lib/cms/validation";

export const createNewsSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: slugSchema,
  excerpt: z.string().max(300).optional(),
  content: z.string().default(""),
  featuredImage: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  status: contentStatusSchema.default("draft"),
  publishedAt: z.coerce.date().optional(),
});

export const updateNewsSchema = createNewsSchema.partial().extend({
  id: z.string().min(1),
});

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
