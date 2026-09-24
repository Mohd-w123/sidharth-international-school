import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface IMedia extends Document {
  filename: string;
  originalName: string;
  url: string;
  publicId: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
  folder?: string;
  tags: string[];
  uploadedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    width: { type: Number },
    height: { type: Number },
    alt: { type: String, trim: true },
    caption: { type: String, trim: true },
    folder: { type: String, trim: true },
    tags: [{ type: String }],
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

MediaSchema.index({ folder: 1 });
MediaSchema.index({ mimeType: 1 });
MediaSchema.index({ tags: 1 });
MediaSchema.index({ createdAt: -1 });
MediaSchema.index({ originalName: "text", alt: "text", caption: "text" });

export const Media: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>("Media", MediaSchema);
