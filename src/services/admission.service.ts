import { BaseService } from "@/lib/cms/base-service";
import { Admission } from "@/models/admission.model";
import type { IAdmission } from "@/models/admission.model";
import { generateSlug, ensureUniqueSlug } from "@/lib/cms/slug";

class AdmissionService extends BaseService<IAdmission> {
  constructor() { super(Admission, ["title", "category"]); }

  async findPublished(session?: string) {
    const extraFilter: Record<string, unknown> = {};
    if (session) extraFilter.session = session;
    return this.findPaginated(
      { pagination: { page: 1, limit: 50 }, sort: { field: "order", order: "asc" } },
      { status: "published", ...extraFilter }
    );
  }

  async findAllSessions() {
    await this.connect();
    return this.model.distinct("session", { status: "published" });
  }

  async generateUniqueSlug(title: string, excludeId?: string) {
    const baseSlug = generateSlug(title);
    return ensureUniqueSlug(baseSlug, async (candidate) => {
      await this.connect();
      const existing = await this.model.findOne({ slug: candidate, ...(excludeId ? { _id: { $ne: excludeId } } : {}) });
      return !!existing;
    });
  }
}

export const admissionService = new AdmissionService();
