import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z.string().min(1, "Email is required").email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.string().min(1, "Role is required"),
  isActive: z.boolean().optional().default(true),
});

export const updateUserSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required").trim(),
  email: z.string().min(1, "Email is required").email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  role: z.string().min(1, "Role is required"),
  isActive: z.boolean().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
