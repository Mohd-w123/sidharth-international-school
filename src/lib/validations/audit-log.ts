import { z } from "zod";

export const auditLogFilterSchema = z.object({
  user: z.string().optional(),
  action: z.string().optional(),
  resource: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});
