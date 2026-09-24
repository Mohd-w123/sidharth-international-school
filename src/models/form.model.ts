import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";
import type { ContentStatus } from "@/types";

export type FormFieldType =
  | "text"
  | "textarea"
  | "email"
  | "phone"
  | "number"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "file";

export interface IFormField {
  label: string;
  name: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: string[];
  validation?: Record<string, unknown>;
  order: number;
}

export interface IForm extends Document {
  title: string;
  slug: string;
  description?: string;
  fields: IFormField[];
  successMessage?: string;
  status: ContentStatus;
  submissionCount: number;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FormFieldSchema = new Schema<IFormField>(
  {
    label: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: [
        "text",
        "textarea",
        "email",
        "phone",
        "number",
        "select",
        "radio",
        "checkbox",
        "date",
        "file",
      ],
      required: true,
    },
    required: { type: Boolean, default: false },
    placeholder: { type: String, trim: true },
    helpText: { type: String, trim: true },
    options: [{ type: String }],
    validation: { type: Schema.Types.Mixed },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const FormSchema = new Schema<IForm>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, trim: true },
    fields: [FormFieldSchema],
    successMessage: { type: String, trim: true },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    submissionCount: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

FormSchema.index({ slug: 1 });
FormSchema.index({ status: 1 });

export const Form: Model<IForm> =
  mongoose.models.Form || mongoose.model<IForm>("Form", FormSchema);
