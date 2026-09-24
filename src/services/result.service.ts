import { BaseService } from "@/lib/cms/base-service";
import { Result } from "@/models/result.model";
import type { IResult } from "@/models/result.model";
import { generateSlug, ensureUniqueSlug } from "@/lib/cms/slug";

class ResultService extends BaseService<IResult> {
  constructor() { super(Result, ["title", "session"]); }

  async findPublished(session?: string, cls?: string) {
    const extra: Record<string, unknown> = {};
    if (session) extra.session = session;
    if (cls) extra.class = cls;
    return this.findPaginated(
      { pagination: { page: 1, limit: 50 }, sort: { field: "createdAt", order: "desc" } },
      { status: "published", ...extra }
    );
  }

  async findPublishedBySlug(slug: string) {
    await this.connect();
    return this.model.findOne({ slug, status: "published" }).lean<IResult>();
  }

  async findAllSessions() {
    await this.connect();
    return this.model.distinct("session", { status: "published" });
  }

  async generateUniqueSlug(title: string, excludeId?: string) {
    const baseSlug = generateSlug(title);
    return ensureUniqueSlug(baseSlug, async (candidate) => {
      await this.connect();
      return !!(await this.model.findOne({ slug: candidate, ...(excludeId ? { _id: { $ne: excludeId } } : {}) }));
    });
  }
}

export const resultService = new ResultService();
