import { BaseService } from "@/lib/cms/base-service";
import { Page } from "@/models/page.model";
import type { IPage } from "@/models/page.model";
import { generateSlug, ensureUniqueSlug } from "@/lib/cms/slug";

class PageService extends BaseService<IPage> {
  constructor() {
    super(Page, ["title", "description"]);
  }

  async findPublishedBySlug(slug: string) {
    await this.connect();
    return this.model.findOne({ slug, status: "published", isDeleted: { $ne: true } }).lean<IPage>();
  }

  async generateUniqueSlug(title: string, excludeId?: string) {
    const baseSlug = generateSlug(title);
    return ensureUniqueSlug(baseSlug, async (candidate) => {
      await this.connect();
      const existing = await this.model.findOne({
        slug: candidate,
        ...(excludeId ? { _id: { $ne: excludeId } } : {}),
      });
      return !!existing;
    });
  }

  async getAllPublishedSlugs(): Promise<string[]> {
    await this.connect();
    const pages = await this.model
      .find({ status: "published", isDeleted: { $ne: true } })
      .select("slug")
      .lean<{ slug: string }[]>();
    return pages.map((p) => p.slug);
  }
}

export const pageService = new PageService();
