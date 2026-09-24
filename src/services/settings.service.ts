import { SiteSetting } from "@/models/site-setting.model";
import type { ISiteSetting } from "@/models/site-setting.model";
import { connectDB } from "@/lib/db";

class SiteSettingService {
  async connect() { await connectDB(); }

  async getAll() {
    await this.connect();
    return SiteSetting.find().sort({ group: 1, key: 1 }).lean<ISiteSetting[]>();
  }

  async getByGroup(group: string) {
    await this.connect();
    return SiteSetting.find({ group }).sort({ key: 1 }).lean<ISiteSetting[]>();
  }

  async getByKey(key: string) {
    await this.connect();
    return SiteSetting.findOne({ key }).lean<ISiteSetting>();
  }

  async getValue(key: string, defaultValue: unknown = null) {
    const setting = await this.getByKey(key);
    return setting?.value ?? defaultValue;
  }

  async upsert(key: string, value: unknown, userId: string, meta?: { group?: string; label?: string; type?: ISiteSetting["type"] }) {
    await this.connect();
    return SiteSetting.findOneAndUpdate(
      { key },
      { $set: { value, updatedBy: userId, ...(meta?.group ? { group: meta.group } : {}), ...(meta?.label ? { label: meta.label } : {}), ...(meta?.type ? { type: meta.type } : {}) } },
      { upsert: true, new: true }
    ).lean<ISiteSetting>();
  }

  async getAllGroups() {
    await this.connect();
    return SiteSetting.distinct("group");
  }

  async getPublicSettings() {
    await this.connect();
    const settings = await SiteSetting.find({
      group: { $in: ["general", "contact", "social", "branding", "topbar", "header", "footer"] },
    }).lean<ISiteSetting[]>();

    const map: Record<string, unknown> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    return map;
  }
}

export const siteSettingService = new SiteSettingService();
