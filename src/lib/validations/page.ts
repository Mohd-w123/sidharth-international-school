import { z } from "zod";
import { slugSchema, contentStatusSchema, seoSchema } from "@/lib/cms/validation";

export const pageBlockSchema = z.object({
  _id: z.string().optional(),
  type: z.string().min(1),
  content: z.record(z.unknown()).default({}),
  order: z.number().int().min(0).default(0),
});

export const createPageSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: slugSchema,
  description: z.string().max(500).optional(),
  banner: z.string().optional(),
  blocks: z.array(pageBlockSchema).default([]),
  template: z.string().optional(),
  status: contentStatusSchema.default("draft"),
  ...seoSchema.shape,
});

export const updatePageSchema = createPageSchema.partial().extend({
  id: z.string().min(1),
});

export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
