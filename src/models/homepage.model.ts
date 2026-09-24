import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";
import type { ContentStatus } from "@/types";

export interface IHomepageSection {
  type: string;
  title?: string;
  content: Record<string, unknown>;
  isEnabled: boolean;
  order: number;
}

export interface IHomepageConfig extends Document {
  sections: IHomepageSection[];
  status: ContentStatus;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const HomepageSectionSchema = new Schema<IHomepageSection>(
  {
    type: { type: String, required: true },
    title: { type: String, trim: true },
    content: { type: Schema.Types.Mixed, default: {} },
    isEnabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const HomepageConfigSchema = new Schema<IHomepageConfig>(
  {
    sections: [HomepageSectionSchema],
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

export const HomepageConfig: Model<IHomepageConfig> =
  mongoose.models.HomepageConfig ||
  mongoose.model<IHomepageConfig>("HomepageConfig", HomepageConfigSchema);
