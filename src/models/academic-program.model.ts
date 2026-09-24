import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";
import type { ContentStatus } from "@/types";

export interface IAcademicProgram extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  status: ContentStatus;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AcademicProgramSchema = new Schema<IAcademicProgram>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    image: { type: String },
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

AcademicProgramSchema.index({ slug: 1 });
AcademicProgramSchema.index({ status: 1, order: 1 });

export const AcademicProgram: Model<IAcademicProgram> =
  mongoose.models.AcademicProgram ||
  mongoose.model<IAcademicProgram>("AcademicProgram", AcademicProgramSchema);
