import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";
import type { ContentStatus } from "@/types";

export type DisclosureFieldType =
  | "text"
  | "number"
  | "date"
  | "boolean"
  | "url"
  | "document"
  | "image"
  | "richtext"
  | "table";

export interface IDisclosureField {
  label: string;
  type: DisclosureFieldType;
  value: unknown;
  order: number;
}

export interface IDisclosureSection extends Document {
  category: Types.ObjectId;
  title: string;
  slug: string;
  description?: string;
  fields: IDisclosureField[];
  order: number;
  status: ContentStatus;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DisclosureFieldSchema = new Schema<IDisclosureField>(
  {
    label: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: [
        "text",
        "number",
        "date",
        "boolean",
        "url",
        "document",
        "image",
        "richtext",
        "table",
      ],
      required: true,
    },
    value: { type: Schema.Types.Mixed },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const DisclosureSectionSchema = new Schema<IDisclosureSection>(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "DisclosureCategory",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    description: { type: String, trim: true },
    fields: [DisclosureFieldSchema],
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

DisclosureSectionSchema.index({ category: 1, order: 1 });
DisclosureSectionSchema.index({ slug: 1, category: 1 });

export const DisclosureSection: Model<IDisclosureSection> =
  mongoose.models.DisclosureSection ||
  mongoose.model<IDisclosureSection>(
    "DisclosureSection",
    DisclosureSectionSchema
  );
