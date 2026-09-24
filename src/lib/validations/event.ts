import { z } from "zod";
import { slugSchema, contentStatusSchema } from "@/lib/cms/validation";

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: slugSchema,
  description: z.string().max(500).optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  eventDate: z.coerce.date({ required_error: "Event date is required" }),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().optional(),
  registrationUrl: z.string().url().optional().or(z.literal("")),
  registrationDeadline: z.coerce.date().optional(),
  status: contentStatusSchema.default("draft"),
});

export const updateEventSchema = createEventSchema.partial().extend({
  id: z.string().min(1),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
