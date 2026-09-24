import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface IFormSubmission extends Document {
  form: Types.ObjectId;
  data: Record<string, unknown>;
  files?: string[];
  ipAddress?: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FormSubmissionSchema = new Schema<IFormSubmission>(
  {
    form: { type: Schema.Types.ObjectId, ref: "Form", required: true },
    data: { type: Schema.Types.Mixed, required: true },
    files: [{ type: String }],
    ipAddress: { type: String },
    isRead: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

FormSubmissionSchema.index({ form: 1, createdAt: -1 });
FormSubmissionSchema.index({ form: 1, isRead: 1 });
FormSubmissionSchema.index({ isArchived: 1 });

export const FormSubmission: Model<IFormSubmission> =
  mongoose.models.FormSubmission ||
  mongoose.model<IFormSubmission>("FormSubmission", FormSubmissionSchema);
