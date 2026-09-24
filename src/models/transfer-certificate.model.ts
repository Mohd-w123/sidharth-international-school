import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface ITransferCertificate extends Document {
  admissionNumber: string;
  studentName: string;
  fatherName?: string;
  motherName?: string;
  dateOfBirth: Date;
  class: string;
  session: string;
  tcNumber: string;
  issueDate: Date;
  documentUrl?: string;
  status: "active" | "revoked";
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TransferCertificateSchema = new Schema<ITransferCertificate>(
  {
    admissionNumber: { type: String, required: true, trim: true },
    studentName: { type: String, required: true, trim: true },
    fatherName: { type: String, trim: true },
    motherName: { type: String, trim: true },
    dateOfBirth: { type: Date, required: true },
    class: { type: String, required: true, trim: true },
    session: { type: String, required: true, trim: true },
    tcNumber: { type: String, required: true, unique: true, trim: true },
    issueDate: { type: Date, required: true },
    documentUrl: { type: String },
    status: { type: String, enum: ["active", "revoked"], default: "active" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

TransferCertificateSchema.index({ admissionNumber: 1, dateOfBirth: 1 });
TransferCertificateSchema.index({ tcNumber: 1 });
TransferCertificateSchema.index({ session: 1, class: 1 });
TransferCertificateSchema.index({ studentName: "text" });
TransferCertificateSchema.index({ isDeleted: 1, status: 1 });

export const TransferCertificate: Model<ITransferCertificate> =
  mongoose.models.TransferCertificate ||
  mongoose.model<ITransferCertificate>(
    "TransferCertificate",
    TransferCertificateSchema
  );
