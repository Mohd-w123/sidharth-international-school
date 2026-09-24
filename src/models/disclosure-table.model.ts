import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface IDisclosureTableColumn {
  key: string;
  label: string;
  order: number;
}

export interface IDisclosureTable extends Document {
  section: Types.ObjectId;
  title: string;
  columns: IDisclosureTableColumn[];
  rows: Record<string, unknown>[];
  order: number;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DisclosureTableColumnSchema = new Schema<IDisclosureTableColumn>(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const DisclosureTableSchema = new Schema<IDisclosureTable>(
  {
    section: {
      type: Schema.Types.ObjectId,
      ref: "DisclosureSection",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    columns: [DisclosureTableColumnSchema],
    rows: [{ type: Schema.Types.Mixed }],
    order: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

DisclosureTableSchema.index({ section: 1, order: 1 });

export const DisclosureTable: Model<IDisclosureTable> =
  mongoose.models.DisclosureTable ||
  mongoose.model<IDisclosureTable>("DisclosureTable", DisclosureTableSchema);
