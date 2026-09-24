import { z } from "zod";
import { slugSchema, contentStatusSchema } from "@/lib/cms/validation";

export const formFieldSchema = z.object({
  label: z.string().min(1, "Label is required"),
  name: z.string().min(1, "Name is required"),
  type: z.enum([
    "text",
    "textarea",
    "email",
    "phone",
    "number",
    "select",
    "radio",
    "checkbox",
    "date",
    "file",
  ]),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
  options: z.array(z.string()).optional(),
  order: z.number().int().min(0).default(0),
});

export const createFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: slugSchema,
  description: z.string().optional(),
  fields: z.array(formFieldSchema).min(1, "At least one field is required"),
  successMessage: z.string().optional(),
  status: contentStatusSchema.default("draft"),
});

export const updateFormSchema = createFormSchema.partial().extend({
  id: z.string().min(1),
});

export type CreateFormInput = z.infer<typeof createFormSchema>;
