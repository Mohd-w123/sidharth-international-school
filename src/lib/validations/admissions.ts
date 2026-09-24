import { z } from "zod";
import { slugSchema, contentStatusSchema } from "@/lib/cms/validation";

export const createAdmissionSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: slugSchema,
  content: z.string().default(""),
  session: z.string().min(1, "Session is required").max(50),
  category: z.string().max(100).optional(),
  order: z.number().int().min(0).default(0),
  status: contentStatusSchema.default("draft"),
});

export const updateAdmissionSchema = createAdmissionSchema.partial().extend({
  id: z.string().min(1),
});

export type CreateAdmissionInput = z.infer<typeof createAdmissionSchema>;
