import type { Model, SortOrder, Types } from "mongoose";
import { connectDB } from "@/lib/db";

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SortParams {
  field: string;
  order: SortOrder;
}

export interface QueryParams {
  search?: string;
  status?: string;
  pagination?: PaginationParams;
  sort?: SortParams;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Filter = Record<string, any>;

export class BaseService<T extends { _id: Types.ObjectId }> {
  constructor(
    protected model: Model<T>,
    protected searchFields: string[] = []
  ) {}

  protected async connect() {
    await connectDB();
  }

  protected buildSearchFilter(search?: string): Filter {
    if (!search || this.searchFields.length === 0) return {};
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    return { $or: this.searchFields.map((field) => ({ [field]: regex })) };
  }

  protected buildStatusFilter(status?: string): Filter {
    if (!status || status === "all") return {};
    return { status };
  }

  protected buildSoftDeleteFilter(includeDeleted = false): Filter {
    if (includeDeleted) return {};
    return { isDeleted: { $ne: true } };
  }

  async findPaginated(
    params: QueryParams,
    extraFilter: Filter = {}
  ): Promise<PaginatedResult<T>> {
    await this.connect();

    const { search, status, pagination, sort } = params;
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const skip = (page - 1) * limit;

    const filter: Filter = {
      ...this.buildSoftDeleteFilter(),
      ...this.buildSearchFilter(search),
      ...this.buildStatusFilter(status),
      ...extraFilter,
    };

    const sortObj: Record<string, SortOrder> = sort
      ? { [sort.field]: sort.order }
      : { createdAt: -1 };

    const [data, total] = await Promise.all([
      this.model.find(filter).sort(sortObj).skip(skip).limit(limit).lean<T[]>(),
      this.model.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async findById(id: string): Promise<T | null> {
    await this.connect();
    return this.model.findOne({ _id: id, isDeleted: { $ne: true } }).lean<T>();
  }

  async findBySlug(slug: string): Promise<T | null> {
    await this.connect();
    return this.model.findOne({ slug, isDeleted: { $ne: true } }).lean<T>();
  }

  async create(data: Partial<T>): Promise<T> {
    await this.connect();
    const doc = await this.model.create(data);
    return doc.toObject() as T;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    await this.connect();
    return this.model
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .lean<T>();
  }

  async softDelete(id: string, userId: string): Promise<boolean> {
    await this.connect();
    const result = await this.model.findByIdAndUpdate(id, {
      $set: { isDeleted: true, deletedAt: new Date(), updatedBy: userId },
    });
    return !!result;
  }

  async hardDelete(id: string): Promise<boolean> {
    await this.connect();
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }

  async publish(id: string, userId: string): Promise<T | null> {
    await this.connect();
    return this.model
      .findByIdAndUpdate(
        id,
        { $set: { status: "published", publishedAt: new Date(), updatedBy: userId } },
        { new: true }
      )
      .lean<T>();
  }

  async unpublish(id: string, userId: string): Promise<T | null> {
    await this.connect();
    return this.model
      .findByIdAndUpdate(
        id,
        { $set: { status: "draft", updatedBy: userId } },
        { new: true }
      )
      .lean<T>();
  }

  async archive(id: string, userId: string): Promise<T | null> {
    await this.connect();
    return this.model
      .findByIdAndUpdate(
        id,
        { $set: { status: "archived", updatedBy: userId } },
        { new: true }
      )
      .lean<T>();
  }

  async count(filter: Filter = {}): Promise<number> {
    await this.connect();
    return this.model.countDocuments({ ...this.buildSoftDeleteFilter(), ...filter });
  }

  async bulkUpdateStatus(ids: string[], status: string, userId: string): Promise<number> {
    await this.connect();
    const result = await this.model.updateMany(
      { _id: { $in: ids } },
      { $set: { status, updatedBy: userId } }
    );
    return result.modifiedCount;
  }

  async bulkDelete(ids: string[], userId: string): Promise<number> {
    await this.connect();
    const result = await this.model.updateMany(
      { _id: { $in: ids } },
      { $set: { isDeleted: true, deletedAt: new Date(), updatedBy: userId } }
    );
    return result.modifiedCount;
  }

  async reorder(items: { id: string; order: number }[]): Promise<void> {
    await this.connect();
    await Promise.all(
      items.map(({ id, order }) =>
        this.model.findByIdAndUpdate(id, { $set: { order } })
      )
    );
  }
}
