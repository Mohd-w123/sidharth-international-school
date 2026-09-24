import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface ISiteSetting extends Document {
  key: string;
  value: unknown;
  group: string;
  label?: string;
  type: "text" | "textarea" | "image" | "boolean" | "json" | "color" | "url";
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingSchema = new Schema<ISiteSetting>(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: Schema.Types.Mixed },
    group: { type: String, required: true, trim: true, default: "general" },
    label: { type: String, trim: true },
    type: {
      type: String,
      enum: ["text", "textarea", "image", "boolean", "json", "color", "url"],
      default: "text",
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

SiteSettingSchema.index({ key: 1 });
SiteSettingSchema.index({ group: 1 });

export const SiteSetting: Model<ISiteSetting> =
  mongoose.models.SiteSetting ||
  mongoose.model<ISiteSetting>("SiteSetting", SiteSettingSchema);
