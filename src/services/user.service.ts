import { BaseService } from "@/lib/cms/base-service";
import { User } from "@/models/user.model";
import type { IUser } from "@/models/user.model";
import bcrypt from "bcryptjs";
import type { QueryParams, PaginatedResult } from "@/lib/cms/base-service";

type Filter = Record<string, unknown>;

class UserService extends BaseService<IUser> {
  constructor() {
    super(User, ["name", "email"]);
  }

  async findPaginated(
    params: QueryParams,
    extraFilter: Filter = {}
  ): Promise<PaginatedResult<IUser>> {
    await this.connect();

    const { search, pagination, sort } = params;
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const skip = (page - 1) * limit;

    const filter: Filter = {
      ...this.buildSearchFilter(search),
      ...extraFilter,
    };

    const sortObj: Record<string, 1 | -1> = sort
      ? { [sort.field]: sort.order === "desc" ? -1 : 1 }
      : { createdAt: -1 };

    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .select("-password")
        .populate("role", "name slug")
        .lean<IUser[]>(),
      this.model.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: items,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async findById(id: string): Promise<IUser | null> {
    await this.connect();
    return this.model
      .findById(id)
      .select("-password")
      .populate("role", "name slug")
      .lean<IUser>();
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role: string;
    isActive?: boolean;
  }): Promise<IUser> {
    await this.connect();

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await this.model.create({
      ...data,
      password: hashedPassword,
    });

    return user.toObject ? user.toObject() : user;
  }

  async updateUser(
    id: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
      isActive?: boolean;
    }
  ): Promise<IUser | null> {
    await this.connect();

    const updateData = { ...data };
    if (updateData.password && updateData.password.trim().length > 0) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    } else {
      delete updateData.password;
    }

    return this.model
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .select("-password")
      .populate("role", "name slug")
      .lean<IUser>();
  }

  async toggleActive(id: string): Promise<IUser | null> {
    await this.connect();
    const user = await this.model.findById(id);
    if (!user) return null;
    return this.model
      .findByIdAndUpdate(id, { $set: { isActive: !user.isActive } }, { new: true })
      .select("-password")
      .lean<IUser>();
  }
}

export const userService = new UserService();
