import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface IGalleryItem extends Document {
  album: Types.ObjectId;
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string;
  title?: string;
  caption?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryItemSchema = new Schema<IGalleryItem>(
  {
    album: { type: Schema.Types.ObjectId, ref: "GalleryAlbum", required: true },
    type: { type: String, enum: ["image", "video"], default: "image" },
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    title: { type: String, trim: true },
    caption: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

GalleryItemSchema.index({ album: 1, order: 1 });

export const GalleryItem: Model<IGalleryItem> =
  mongoose.models.GalleryItem ||
  mongoose.model<IGalleryItem>("GalleryItem", GalleryItemSchema);
