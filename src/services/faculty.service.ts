import { BaseService } from "@/lib/cms/base-service";
import { Faculty } from "@/models/faculty.model";
import type { IFaculty } from "@/models/faculty.model";
import { generateSlug, ensureUniqueSlug } from "@/lib/cms/slug";

class FacultyService extends BaseService<IFaculty> {
  constructor() {
    super(Faculty, ["name", "designation", "department"]);
  }

  async findPublished(page = 1, limit = 50, department?: string) {
    const extraFilter: Record<string, unknown> = {};
    if (department) extraFilter.department = department;
    return this.findPaginated(
      { pagination: { page, limit }, sort: { field: "order", order: "asc" } },
      { status: "published", ...extraFilter }
    );
  }

  async findAllDepartments() {
    await this.connect();
    const departments = await this.model.distinct("department", {
      status: "published",
      department: { $nin: [null, ""] },
    });
    return departments.filter(Boolean) as string[];
  }

  async generateUniqueSlug(name: string, excludeId?: string) {
    const baseSlug = generateSlug(name);
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

export const facultyService = new FacultyService();
