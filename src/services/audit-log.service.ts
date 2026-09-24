import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { AuditLog } from "@/models/audit-log.model";
import type { IAuditLog } from "@/models/audit-log.model";

class AuditLogService {
  async connect() { await connectDB(); }

  async findPaginated(params: {
    page?: number; limit?: number; search?: string;
    action?: string; resource?: string; user?: string;
    from?: Date; to?: Date;
  }) {
    await this.connect();
    const { page = 1, limit = 25, search, action, resource, user, from, to } = params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};

    if (search) {
      filter.$or = [
        { action: { $regex: search, $options: "i" } },
        { resource: { $regex: search, $options: "i" } },
      ];
    }
    if (action) filter.action = action;
    if (resource) filter.resource = resource;
    if (user) filter.user = user;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = from;
      if (to) filter.createdAt.$lte = to;
    }

    const [data, total] = await Promise.all([
      AuditLog.find(filter)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<IAuditLog[]>(),
      AuditLog.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getDistinctActions() {
    await this.connect();
    return AuditLog.distinct("action");
  }

  async getDistinctResources() {
    await this.connect();
    return AuditLog.distinct("resource");
  }

  async log(userId: string, action: string, resource: string, resourceId?: string, details?: Record<string, unknown>) {
    await this.connect();
    return AuditLog.create({ user: userId, action, resource, resourceId, details });
  }

  async getRecentByUser(userId: string, limit = 10) {
    await this.connect();
    return AuditLog.find({ user: userId }).sort({ createdAt: -1 }).limit(limit).lean<IAuditLog[]>();
  }
}

export const auditLogService = new AuditLogService();
