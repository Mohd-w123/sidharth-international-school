import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";
import type { ContentStatus } from "@/types";

export interface ISubject extends Document {
  name: string;
  code?: string;
  class?: Types.ObjectId;
  department?: string;
  description?: string;
  order: number;
  status: ContentStatus;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    class: { type: Schema.Types.ObjectId, ref: "Class" },
    department: { type: String, trim: true },
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

SubjectSchema.index({ class: 1 });
SubjectSchema.index({ department: 1 });
SubjectSchema.index({ status: 1, order: 1 });

export const Subject: Model<ISubject> =
  mongoose.models.Subject || mongoose.model<ISubject>("Subject", SubjectSchema);
