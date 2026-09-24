import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface IMenuItem {
  label: string;
  url?: string;
  pageRef?: Types.ObjectId;
  target: "_self" | "_blank";
  isEnabled: boolean;
  order: number;
  children: IMenuItem[];
}

export interface IMenu extends Document {
  name: string;
  slug: string;
  location: "header" | "footer" | "secondary";
  items: IMenuItem[];
  isActive: boolean;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, trim: true },
    pageRef: { type: Schema.Types.ObjectId, ref: "Page" },
    target: { type: String, enum: ["_self", "_blank"], default: "_self" },
    isEnabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    children: { type: [{ type: Schema.Types.Mixed }], default: [] },
  },
  { _id: true }
);

const MenuSchema = new Schema<IMenu>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    location: {
      type: String,
      enum: ["header", "footer", "secondary"],
      required: true,
    },
    items: [MenuItemSchema],
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

MenuSchema.index({ slug: 1 });
MenuSchema.index({ location: 1, isActive: 1 });

export const Menu: Model<IMenu> =
  mongoose.models.Menu || mongoose.model<IMenu>("Menu", MenuSchema);
