import { z } from "zod";
import { slugSchema, contentStatusSchema } from "@/lib/cms/validation";

export const createResultSchema = z.object({
  title: z.string().min(1).max(200),
  slug: slugSchema,
  session: z.string().min(1).max(50),
  class: z.string().max(50).optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  tableData: z.array(z.record(z.unknown())).optional(),
  statistics: z.record(z.unknown()).optional(),
  status: contentStatusSchema.default("draft"),
});

export const updateResultSchema = createResultSchema.partial().extend({ id: z.string().min(1) });
