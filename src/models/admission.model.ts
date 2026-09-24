import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";
import type { ContentStatus } from "@/types";

export interface IAdmission extends Document {
  title: string;
  slug: string;
  content: string;
  session: string;
  category?: string;
  order: number;
  status: ContentStatus;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionSchema = new Schema<IAdmission>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, default: "" },
    session: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
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

AdmissionSchema.index({ slug: 1 });
AdmissionSchema.index({ session: 1, status: 1, order: 1 });

export const Admission: Model<IAdmission> =
  mongoose.models.Admission ||
  mongoose.model<IAdmission>("Admission", AdmissionSchema);
