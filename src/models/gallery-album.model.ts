import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";
import type { ContentStatus } from "@/types";

export interface IGalleryAlbum extends Document {
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
  type: "photo" | "video";
  status: ContentStatus;
  order: number;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryAlbumSchema = new Schema<IGalleryAlbum>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, trim: true },
    coverImage: { type: String },
    type: { type: String, enum: ["photo", "video"], default: "photo" },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    order: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

GalleryAlbumSchema.index({ slug: 1 });
GalleryAlbumSchema.index({ status: 1, isDeleted: 1, type: 1 });
GalleryAlbumSchema.index({ order: 1 });

export const GalleryAlbum: Model<IGalleryAlbum> =
  mongoose.models.GalleryAlbum ||
  mongoose.model<IGalleryAlbum>("GalleryAlbum", GalleryAlbumSchema);
