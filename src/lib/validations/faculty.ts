import { z } from "zod";
import { slugSchema, contentStatusSchema } from "@/lib/cms/validation";

export const createFacultySchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: slugSchema,
  photo: z.string().optional(),
  designation: z.string().min(1, "Designation is required").max(200),
  department: z.string().max(200).optional(),
  subject: z.string().max(200).optional(),
  qualification: z.string().max(300).optional(),
  experience: z.string().max(200).optional(),
  bio: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  order: z.number().int().min(0).default(0),
  status: contentStatusSchema.default("draft"),
});

export const updateFacultySchema = createFacultySchema.partial().extend({
  id: z.string().min(1),
});

export type CreateFacultyInput = z.infer<typeof createFacultySchema>;
export type UpdateFacultyInput = z.infer<typeof updateFacultySchema>;
