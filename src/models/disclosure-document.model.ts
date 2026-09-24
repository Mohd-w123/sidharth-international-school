import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface IDisclosureDocument extends Document {
  section: Types.ObjectId;
  title: string;
  description?: string;
  documentType?: string;
  fileUrl: string;
  order: number;
  isActive: boolean;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DisclosureDocumentSchema = new Schema<IDisclosureDocument>(
  {
    section: {
      type: Schema.Types.ObjectId,
      ref: "DisclosureSection",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    documentType: { type: String, trim: true },
    fileUrl: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

DisclosureDocumentSchema.index({ section: 1, order: 1 });
DisclosureDocumentSchema.index({ isActive: 1 });

export const DisclosureDocument: Model<IDisclosureDocument> =
  mongoose.models.DisclosureDocument ||
  mongoose.model<IDisclosureDocument>(
    "DisclosureDocument",
    DisclosureDocumentSchema
  );
