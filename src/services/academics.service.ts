import { BaseService } from "@/lib/cms/base-service";
import { AcademicProgram } from "@/models/academic-program.model";
import { Class } from "@/models/class.model";
import { Subject } from "@/models/subject.model";
import { AcademicCalendar } from "@/models/academic-calendar.model";
import type { IAcademicProgram } from "@/models/academic-program.model";
import type { IClass } from "@/models/class.model";
import type { ISubject } from "@/models/subject.model";
import type { IAcademicCalendar } from "@/models/academic-calendar.model";
import { generateSlug, ensureUniqueSlug } from "@/lib/cms/slug";

class ProgramService extends BaseService<IAcademicProgram> {
  constructor() {
    super(AcademicProgram, ["name"]);
  }

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
      const existing = await this.model.findOne({
        slug: candidate,
        ...(excludeId ? { _id: { $ne: excludeId } } : {}),
      });
      return !!existing;
    });
  }
}

class ClassService extends BaseService<IClass> {
  constructor() {
    super(Class, ["name"]);
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

class SubjectService extends BaseService<ISubject> {
  constructor() {
    super(Subject, ["name", "code"]);
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

class CalendarService extends BaseService<IAcademicCalendar> {
  constructor() {
    super(AcademicCalendar, ["title"]);
  }

  async findBySession(session: string) {
    return this.findPaginated(
      { pagination: { page: 1, limit: 200 }, sort: { field: "date", order: "asc" } },
      { session, status: "published" }
    );
  }

  async findAllSessions() {
    await this.connect();
    return this.model.distinct("session", { status: "published" });
  }
}

export const programService = new ProgramService();
export const classService = new ClassService();
export const subjectService = new SubjectService();
export const calendarService = new CalendarService();
