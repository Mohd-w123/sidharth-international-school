import { connectDB } from "@/lib/db";
import { Menu } from "@/models/menu.model";
import type { IMenu } from "@/models/menu.model";

class MenuService {
  async findAll() {
    await connectDB();
    return Menu.find({ isActive: true }).sort({ location: 1 }).lean<IMenu[]>();
  }

  async findById(id: string) {
    await connectDB();
    return Menu.findById(id).lean<IMenu>();
  }

  async findBySlug(slug: string) {
    await connectDB();
    return Menu.findOne({ slug }).lean<IMenu>();
  }

  async findByLocation(location: IMenu["location"]) {
    await connectDB();
    return Menu.findOne({ location, isActive: true }).lean<IMenu>();
  }

  async create(data: Partial<IMenu>) {
    await connectDB();
    const doc = await Menu.create(data);
    return doc.toObject();
  }

  async update(id: string, data: Partial<IMenu>) {
    await connectDB();
    return Menu.findByIdAndUpdate(id, { $set: data }, { new: true }).lean<IMenu>();
  }

  async delete(id: string) {
    await connectDB();
    const result = await Menu.findByIdAndDelete(id);
    return !!result;
  }
}

export const menuService = new MenuService();
