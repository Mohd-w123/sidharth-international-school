import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";
import type { ContentStatus } from "@/types";

export interface IClass extends Document {
  name: string;
  slug: string;
  program?: Types.ObjectId;
  section?: string;
  description?: string;
  order: number;
  status: ContentStatus;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema = new Schema<IClass>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    program: { type: Schema.Types.ObjectId, ref: "AcademicProgram" },
    section: { type: String, trim: true },
    description: { type: String },
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

ClassSchema.index({ slug: 1 });
ClassSchema.index({ program: 1, status: 1 });
ClassSchema.index({ status: 1, order: 1 });

export const Class: Model<IClass> =
  mongoose.models.Class || mongoose.model<IClass>("Class", ClassSchema);
