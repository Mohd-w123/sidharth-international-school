import { BaseService } from "@/lib/cms/base-service";
import { News } from "@/models/news.model";
import type { INews } from "@/models/news.model";
import { generateSlug, ensureUniqueSlug } from "@/lib/cms/slug";

class NewsService extends BaseService<INews> {
  constructor() {
    super(News, ["title", "excerpt"]);
  }

  async findPublishedBySlug(slug: string) {
    await this.connect();
    return this.model.findOne({ slug, status: "published", isDeleted: { $ne: true } }).lean<INews>();
  }

  async findPublished(page = 1, limit = 12) {
    return this.findPaginated(
      { pagination: { page, limit }, sort: { field: "publishedAt", order: "desc" } },
      { status: "published" }
    );
  }

  async findFeatured(limit = 5) {
    await this.connect();
    return this.model
      .find({ status: "published", isFeatured: true, isDeleted: { $ne: true } })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean<INews[]>();
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
}

export const newsService = new NewsService();
