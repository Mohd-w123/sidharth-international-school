import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";
import type { ContentStatus } from "@/types";

export interface IDisclosureCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  order: number;
  status: ContentStatus;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DisclosureCategorySchema = new Schema<IDisclosureCategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, trim: true },
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

DisclosureCategorySchema.index({ slug: 1 });
DisclosureCategorySchema.index({ status: 1, order: 1 });

export const DisclosureCategory: Model<IDisclosureCategory> =
  mongoose.models.DisclosureCategory ||
  mongoose.model<IDisclosureCategory>(
    "DisclosureCategory",
    DisclosureCategorySchema
  );
