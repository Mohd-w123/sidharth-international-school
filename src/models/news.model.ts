import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";
import type { ContentStatus } from "@/types";

export interface INews extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  category?: string;
  tags: string[];
  isFeatured: boolean;
  status: ContentStatus;
  publishedAt?: Date;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, trim: true },
    content: { type: String, default: "" },
    featuredImage: { type: String },
    category: { type: String, trim: true },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

NewsSchema.index({ slug: 1 });
NewsSchema.index({ status: 1, isDeleted: 1, publishedAt: -1 });
NewsSchema.index({ category: 1 });
NewsSchema.index({ isFeatured: 1, status: 1 });
NewsSchema.index({ title: "text", excerpt: "text" });

export const News: Model<INews> =
  mongoose.models.News || mongoose.model<INews>("News", NewsSchema);
