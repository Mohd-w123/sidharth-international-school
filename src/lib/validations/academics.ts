import { z } from "zod";
import { slugSchema, contentStatusSchema } from "@/lib/cms/validation";

// Academic Programs
export const createProgramSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: slugSchema,
  description: z.string().optional(),
  image: z.string().optional(),
  order: z.number().int().min(0).default(0),
  status: contentStatusSchema.default("draft"),
});

export const updateProgramSchema = createProgramSchema.partial().extend({
  id: z.string().min(1),
});

// Classes
export const createClassSchema = z.object({
  name: z.string().min(1).max(100),
  slug: slugSchema,
  section: z.string().max(50).optional(),
  program: z.string().optional(),
  order: z.number().int().min(0).default(0),
  status: contentStatusSchema.default("draft"),
});

export const updateClassSchema = createClassSchema.partial().extend({
  id: z.string().min(1),
});

// Subjects
export const createSubjectSchema = z.object({
  name: z.string().min(1).max(200),
  slug: slugSchema,
  code: z.string().max(20).optional(),
  class: z.string().optional(),
  department: z.string().max(100).optional(),
  order: z.number().int().min(0).default(0),
  status: contentStatusSchema.default("draft"),
});

export const updateSubjectSchema = createSubjectSchema.partial().extend({
  id: z.string().min(1),
});

// Academic Calendar
export const createCalendarEventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  date: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  type: z.enum(["holiday", "exam", "event", "meeting", "other"]).default("other"),
  session: z.string().min(1).max(50),
  status: contentStatusSchema.default("draft"),
});

export const updateCalendarEventSchema = createCalendarEventSchema.partial().extend({
  id: z.string().min(1),
});

export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type CreateClassInput = z.infer<typeof createClassSchema>;
export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type CreateCalendarEventInput = z.infer<typeof createCalendarEventSchema>;
