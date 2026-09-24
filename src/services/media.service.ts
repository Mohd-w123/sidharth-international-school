import { connectDB } from "@/lib/db";
import { Media } from "@/models/media.model";
import type { IMedia } from "@/models/media.model";
import type { QueryParams, PaginatedResult } from "@/lib/cms/base-service";

class MediaService {
  async findPaginated(params: QueryParams, extraFilter: Record<string, unknown> = {}): Promise<PaginatedResult<IMedia>> {
    await connectDB();
    const { search, pagination, sort } = params;
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 24;
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = { ...extraFilter };
    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ originalName: regex }, { alt: regex }, { caption: regex }];
    }

    const sortObj = sort ? { [sort.field]: sort.order } : { createdAt: -1 as const };

    const [data, total] = await Promise.all([
      Media.find(filter).sort(sortObj).skip(skip).limit(limit).lean<IMedia[]>(),
      Media.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);
    return { data, total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
  }

  async findById(id: string) {
    await connectDB();
    return Media.findById(id).lean<IMedia>();
  }

  async create(data: Partial<IMedia>) {
    await connectDB();
    const doc = await Media.create(data);
    return doc.toObject() as IMedia;
  }

  async update(id: string, data: Partial<IMedia>) {
    await connectDB();
    return Media.findByIdAndUpdate(id, { $set: data }, { new: true }).lean<IMedia>();
  }

  async delete(id: string) {
    await connectDB();
    const result = await Media.findByIdAndDelete(id);
    return !!result;
  }

  async findByFolder(folder: string) {
    await connectDB();
    return Media.find({ folder }).sort({ createdAt: -1 }).lean<IMedia[]>();
  }

  async getFolders(): Promise<string[]> {
    await connectDB();
    const folders = await Media.distinct("folder", { folder: { $nin: [null, ""] } });
    return folders.filter(Boolean) as string[];
  }
}

export const mediaService = new MediaService();
