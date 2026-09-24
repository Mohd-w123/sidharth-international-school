import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";
import type { ContentStatus } from "@/types";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description?: string;
  content?: string;
  image?: string;
  eventDate: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  registrationUrl?: string;
  registrationDeadline?: Date;
  status: ContentStatus;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, trim: true },
    content: { type: String },
    image: { type: String },
    eventDate: { type: Date, required: true },
    startTime: { type: String },
    endTime: { type: String },
    location: { type: String, trim: true },
    registrationUrl: { type: String, trim: true },
    registrationDeadline: { type: Date },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

EventSchema.index({ slug: 1 });
EventSchema.index({ status: 1, isDeleted: 1, eventDate: -1 });
EventSchema.index({ eventDate: 1 });

export const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
