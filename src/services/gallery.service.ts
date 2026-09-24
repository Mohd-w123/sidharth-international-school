import { BaseService } from "@/lib/cms/base-service";
import { GalleryAlbum } from "@/models/gallery-album.model";
import { GalleryItem } from "@/models/gallery-item.model";
import type { IGalleryAlbum } from "@/models/gallery-album.model";
import type { IGalleryItem } from "@/models/gallery-item.model";
import { generateSlug, ensureUniqueSlug } from "@/lib/cms/slug";
import { connectDB } from "@/lib/db";

class GalleryAlbumService extends BaseService<IGalleryAlbum> {
  constructor() {
    super(GalleryAlbum, ["title"]);
  }

  async findPublished(page = 1, limit = 12, type?: "photo" | "video") {
    const extraFilter: Record<string, unknown> = {};
    if (type) extraFilter.type = type;
    return this.findPaginated(
      { pagination: { page, limit }, sort: { field: "order", order: "asc" } },
      { status: "published", ...extraFilter }
    );
  }

  async findPublishedBySlug(slug: string) {
    await this.connect();
    return this.model
      .findOne({ slug, status: "published", isDeleted: { $ne: true } })
      .lean<IGalleryAlbum>();
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

  // Gallery item management
  async getItems(albumId: string) {
    await connectDB();
    return GalleryItem.find({ album: albumId })
      .sort({ order: 1 })
      .lean<IGalleryItem[]>();
  }

  async addItem(data: Partial<IGalleryItem>) {
    await connectDB();
    const doc = await GalleryItem.create(data);
    return doc.toObject() as IGalleryItem;
  }

  async updateItem(id: string, data: Partial<IGalleryItem>) {
    await connectDB();
    return GalleryItem.findByIdAndUpdate(id, { $set: data }, { new: true }).lean<IGalleryItem>();
  }

  async removeItem(id: string) {
    await connectDB();
    const result = await GalleryItem.findByIdAndDelete(id);
    return !!result;
  }

  async reorderItems(items: { id: string; order: number }[]) {
    await connectDB();
    await Promise.all(
      items.map(({ id, order }) =>
        GalleryItem.findByIdAndUpdate(id, { $set: { order } })
      )
    );
  }

  async getItemCount(albumId: string) {
    await connectDB();
    return GalleryItem.countDocuments({ album: albumId });
  }
}

export const galleryService = new GalleryAlbumService();
