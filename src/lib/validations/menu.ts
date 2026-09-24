import { z } from "zod";
import { slugSchema } from "@/lib/cms/validation";

export const menuItemSchema: z.ZodType = z.lazy(() =>
  z.object({
    _id: z.string().optional(),
    label: z.string().min(1, "Label is required"),
    url: z.string().optional(),
    pageRef: z.string().optional(),
    target: z.enum(["_self", "_blank"]).default("_self"),
    isEnabled: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
    children: z.array(menuItemSchema).default([]),
  })
);

export const createMenuSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: slugSchema,
  location: z.enum(["header", "footer", "secondary"]),
  items: z.array(menuItemSchema).default([]),
  isActive: z.boolean().default(true),
});

export const updateMenuSchema = createMenuSchema.partial().extend({
  id: z.string().min(1),
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;
export type CreateMenuInput = z.infer<typeof createMenuSchema>;
export type UpdateMenuInput = z.infer<typeof updateMenuSchema>;
