import { z } from "zod";

export const createTCSchema = z.object({
  admissionNumber: z.string().min(1, "Admission number is required"),
  studentName: z.string().min(1, "Student name is required"),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  dateOfBirth: z.coerce.date(),
  class: z.string().min(1, "Class is required"),
  session: z.string().min(1, "Session is required"),
  tcNumber: z.string().min(1, "TC number is required"),
  issueDate: z.coerce.date(),
  documentUrl: z.string().optional(),
  status: z.enum(["active", "revoked"]).default("active"),
});

export const updateTCSchema = createTCSchema.partial().extend({ id: z.string().min(1) });

export const tcSearchSchema = z.object({
  admissionNumber: z.string().min(1, "Admission number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

export type CreateTCInput = z.infer<typeof createTCSchema>;
