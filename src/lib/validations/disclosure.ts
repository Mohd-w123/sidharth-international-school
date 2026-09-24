import { z } from "zod";
import { slugSchema, contentStatusSchema } from "@/lib/cms/validation";

export const createDisclosureCategorySchema = z.object({
  name: z.string().min(1).max(200),
  slug: slugSchema,
  description: z.string().optional(),
  order: z.number().int().min(0).default(0),
  status: contentStatusSchema.default("draft"),
});

export const updateDisclosureCategorySchema = createDisclosureCategorySchema.partial().extend({ id: z.string().min(1) });

export const createDisclosureSectionSchema = z.object({
  category: z.string().min(1),
  title: z.string().min(1).max(200),
  slug: slugSchema,
  description: z.string().optional(),
  fields: z.array(z.object({
    label: z.string().min(1),
    type: z.enum(["text", "number", "date", "boolean", "url", "document", "image", "richtext", "table"]),
    value: z.unknown().optional(),
    order: z.number().int().min(0).default(0),
  })).default([]),
  order: z.number().int().min(0).default(0),
  status: contentStatusSchema.default("draft"),
});

export const updateDisclosureSectionSchema = createDisclosureSectionSchema.partial().extend({ id: z.string().min(1) });

export const createDisclosureTableSchema = z.object({
  section: z.string().min(1),
  title: z.string().min(1).max(200),
  columns: z.array(z.object({ key: z.string(), label: z.string(), order: z.number().default(0) })).min(1),
  rows: z.array(z.record(z.unknown())).default([]),
  order: z.number().int().min(0).default(0),
});

export const updateDisclosureTableSchema = createDisclosureTableSchema.partial().extend({ id: z.string().min(1) });

export const createDisclosureDocumentSchema = z.object({
  section: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  documentType: z.string().optional(),
  fileUrl: z.string().min(1),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateDisclosureDocumentSchema = createDisclosureDocumentSchema.partial().extend({ id: z.string().min(1) });
