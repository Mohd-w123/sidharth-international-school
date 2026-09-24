import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";
import type { ContentStatus } from "@/types";

export interface IAcademicCalendar extends Document {
  title: string;
  description?: string;
  date: Date;
  endDate?: Date;
  type: "holiday" | "exam" | "event" | "meeting" | "other";
  session: string;
  status: ContentStatus;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AcademicCalendarSchema = new Schema<IAcademicCalendar>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    date: { type: Date, required: true },
    endDate: { type: Date },
    type: {
      type: String,
      enum: ["holiday", "exam", "event", "meeting", "other"],
      default: "other",
    },
    session: { type: String, required: true, trim: true },
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

AcademicCalendarSchema.index({ date: 1 });
AcademicCalendarSchema.index({ session: 1, type: 1, status: 1 });

export const AcademicCalendar: Model<IAcademicCalendar> =
  mongoose.models.AcademicCalendar ||
  mongoose.model<IAcademicCalendar>("AcademicCalendar", AcademicCalendarSchema);
