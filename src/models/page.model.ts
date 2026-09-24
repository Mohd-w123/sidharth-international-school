import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";
import type { ContentStatus } from "@/types";

export interface IPageBlock {
  type: string;
  content: Record<string, unknown>;
  order: number;
}

export interface IPage extends Document {
  title: string;
  slug: string;
  description?: string;
  banner?: string;
  blocks: IPageBlock[];
  status: ContentStatus;
  template?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  publishedAt?: Date;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PageBlockSchema = new Schema<IPageBlock>(
  {
    type: { type: String, required: true },
    content: { type: Schema.Types.Mixed, default: {} },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const PageSchema = new Schema<IPage>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, trim: true },
    banner: { type: String },
    blocks: [PageBlockSchema],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    template: { type: String },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    seoKeywords: [{ type: String }],
    publishedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

PageSchema.index({ slug: 1 });
PageSchema.index({ status: 1, isDeleted: 1 });
PageSchema.index({ createdAt: -1 });

export const Page: Model<IPage> =
  mongoose.models.Page || mongoose.model<IPage>("Page", PageSchema);
