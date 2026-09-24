import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";
import type { ContentStatus } from "@/types";

export interface IResult extends Document {
  title: string;
  slug: string;
  session: string;
  class?: string;
  description?: string;
  content?: string;
  tableData?: Record<string, unknown>[];
  statistics?: Record<string, unknown>;
  status: ContentStatus;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ResultSchema = new Schema<IResult>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    session: { type: String, required: true, trim: true },
    class: { type: String, trim: true },
    description: { type: String },
    content: { type: String },
    tableData: [{ type: Schema.Types.Mixed }],
    statistics: { type: Schema.Types.Mixed },
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

ResultSchema.index({ slug: 1 });
ResultSchema.index({ session: 1, status: 1 });
ResultSchema.index({ class: 1, session: 1 });

export const Result: Model<IResult> =
  mongoose.models.Result || mongoose.model<IResult>("Result", ResultSchema);
