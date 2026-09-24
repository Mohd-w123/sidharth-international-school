import { connectDB } from "@/lib/db";
import { HomepageConfig } from "@/models/homepage.model";
import type { HomepageSectionInput } from "@/lib/validations/homepage";

export class HomepageService {
  async getConfig() {
    await connectDB();
    let config = await HomepageConfig.findOne().lean();
    if (!config) {
      config = await HomepageConfig.create({ sections: [], status: "draft" });
      return config.toObject ? config.toObject() : config;
    }
    return config;
  }

  async getPublishedConfig() {
    await connectDB();
    return HomepageConfig.findOne({ status: "published" }).lean();
  }

  async updateSections(sections: HomepageSectionInput[], userId: string) {
    await connectDB();
    const config = await HomepageConfig.findOneAndUpdate(
      {},
      { $set: { sections, updatedBy: userId } },
      { new: true, upsert: true }
    ).lean();
    return config;
  }

  async publish(userId: string) {
    await connectDB();
    return HomepageConfig.findOneAndUpdate(
      {},
      { $set: { status: "published", updatedBy: userId } },
      { new: true, upsert: true }
    ).lean();
  }

  async unpublish(userId: string) {
    await connectDB();
    return HomepageConfig.findOneAndUpdate(
      {},
      { $set: { status: "draft", updatedBy: userId } },
      { new: true }
    ).lean();
  }
}

export const homepageService = new HomepageService();
