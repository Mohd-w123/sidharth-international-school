import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";
import type { ContentStatus } from "@/types";

export interface IFaculty extends Document {
  name: string;
  slug: string;
  photo?: string;
  designation: string;
  department?: string;
  subject?: string;
  qualification?: string;
  experience?: string;
  bio?: string;
  email?: string;
  order: number;
  status: ContentStatus;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FacultySchema = new Schema<IFaculty>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    photo: { type: String },
    designation: { type: String, required: true, trim: true },
    department: { type: String, trim: true },
    subject: { type: String, trim: true },
    qualification: { type: String, trim: true },
    experience: { type: String, trim: true },
    bio: { type: String },
    email: { type: String, trim: true, lowercase: true },
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

FacultySchema.index({ slug: 1 });
FacultySchema.index({ status: 1, order: 1 });
FacultySchema.index({ department: 1 });

export const Faculty: Model<IFaculty> =
  mongoose.models.Faculty || mongoose.model<IFaculty>("Faculty", FacultySchema);
