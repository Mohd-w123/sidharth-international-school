import { BaseService } from "@/lib/cms/base-service";
import { Event } from "@/models/event.model";
import type { IEvent } from "@/models/event.model";
import { generateSlug, ensureUniqueSlug } from "@/lib/cms/slug";

class EventService extends BaseService<IEvent> {
  constructor() {
    super(Event, ["title", "description", "location"]);
  }

  async findPublishedBySlug(slug: string) {
    await this.connect();
    return this.model.findOne({ slug, status: "published", isDeleted: { $ne: true } }).lean<IEvent>();
  }

  async findUpcoming(limit = 10) {
    await this.connect();
    return this.model
      .find({ status: "published", isDeleted: { $ne: true }, eventDate: { $gte: new Date() } })
      .sort({ eventDate: 1 })
      .limit(limit)
      .lean<IEvent[]>();
  }

  async findPast(page = 1, limit = 12) {
    return this.findPaginated(
      { pagination: { page, limit }, sort: { field: "eventDate", order: "desc" } },
      { status: "published", eventDate: { $lt: new Date() } }
    );
  }

  async findPublished(page = 1, limit = 12) {
    return this.findPaginated(
      { pagination: { page, limit }, sort: { field: "eventDate", order: "desc" } },
      { status: "published" }
    );
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

export const eventService = new EventService();
