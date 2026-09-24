import { BaseService } from "@/lib/cms/base-service";
import { DisclosureCategory } from "@/models/disclosure-category.model";
import { DisclosureSection } from "@/models/disclosure-section.model";
import { DisclosureTable } from "@/models/disclosure-table.model";
import { DisclosureDocument } from "@/models/disclosure-document.model";
import type { IDisclosureCategory } from "@/models/disclosure-category.model";
import type { IDisclosureSection } from "@/models/disclosure-section.model";
import type { IDisclosureTable } from "@/models/disclosure-table.model";
import type { IDisclosureDocument } from "@/models/disclosure-document.model";
import { generateSlug, ensureUniqueSlug } from "@/lib/cms/slug";
import { connectDB } from "@/lib/db";

class DisclosureCategoryService extends BaseService<IDisclosureCategory> {
  constructor() { super(DisclosureCategory, ["name"]); }

  async findPublished() {
    return this.findPaginated(
      { pagination: { page: 1, limit: 50 }, sort: { field: "order", order: "asc" } },
      { status: "published" }
    );
  }

  async generateUniqueSlug(name: string, excludeId?: string) {
    const baseSlug = generateSlug(name);
    return ensureUniqueSlug(baseSlug, async (candidate) => {
      await this.connect();
      return !!(await this.model.findOne({ slug: candidate, ...(excludeId ? { _id: { $ne: excludeId } } : {}) }));
    });
  }
}

class DisclosureSectionService extends BaseService<IDisclosureSection> {
  constructor() { super(DisclosureSection, ["title"]); }

  async findByCategory(categoryId: string) {
    await this.connect();
    return this.model.find({ category: categoryId }).sort({ order: 1 }).lean<IDisclosureSection[]>();
  }

  async findPublishedByCategory(categoryId: string) {
    await this.connect();
    return this.model.find({ category: categoryId, status: "published" }).sort({ order: 1 }).lean<IDisclosureSection[]>();
  }
}

class DisclosureTableService {
  async findBySection(sectionId: string) {
    await connectDB();
    return DisclosureTable.find({ section: sectionId }).sort({ order: 1 }).lean<IDisclosureTable[]>();
  }

  async create(data: Partial<IDisclosureTable>) {
    await connectDB();
    return (await DisclosureTable.create(data)).toObject() as IDisclosureTable;
  }

  async update(id: string, data: Partial<IDisclosureTable>) {
    await connectDB();
    return DisclosureTable.findByIdAndUpdate(id, { $set: data }, { new: true }).lean<IDisclosureTable>();
  }

  async delete(id: string) {
    await connectDB();
    return DisclosureTable.findByIdAndDelete(id);
  }
}

class DisclosureDocumentService {
  async findBySection(sectionId: string) {
    await connectDB();
    return DisclosureDocument.find({ section: sectionId }).sort({ order: 1 }).lean<IDisclosureDocument[]>();
  }

  async create(data: Partial<IDisclosureDocument>) {
    await connectDB();
    return (await DisclosureDocument.create(data)).toObject() as IDisclosureDocument;
  }

  async update(id: string, data: Partial<IDisclosureDocument>) {
    await connectDB();
    return DisclosureDocument.findByIdAndUpdate(id, { $set: data }, { new: true }).lean<IDisclosureDocument>();
  }

  async delete(id: string) {
    await connectDB();
    return DisclosureDocument.findByIdAndDelete(id);
  }
}

export const disclosureCategoryService = new DisclosureCategoryService();
export const disclosureSectionService = new DisclosureSectionService();
export const disclosureTableService = new DisclosureTableService();
export const disclosureDocumentService = new DisclosureDocumentService();
