import { BaseService } from "@/lib/cms/base-service";
import { Form } from "@/models/form.model";
import { FormSubmission } from "@/models/form-submission.model";
import type { IForm } from "@/models/form.model";
import type { IFormSubmission } from "@/models/form-submission.model";
import { generateSlug, ensureUniqueSlug } from "@/lib/cms/slug";
import { connectDB } from "@/lib/db";

class FormService extends BaseService<IForm> {
  constructor() {
    super(Form, ["title"]);
  }

  async findPublishedBySlug(slug: string) {
    await this.connect();
    return this.model.findOne({ slug, status: "published" }).lean<IForm>();
  }

  async generateUniqueSlug(title: string, excludeId?: string) {
    const baseSlug = generateSlug(title);
    return ensureUniqueSlug(baseSlug, async (candidate) => {
      await this.connect();
      return !!(await this.model.findOne({ slug: candidate, ...(excludeId ? { _id: { $ne: excludeId } } : {}) }));
    });
  }

  // Submissions
  async getSubmissions(formId: string, page = 1, limit = 20) {
    await connectDB();
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      FormSubmission.find({ form: formId, isArchived: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<IFormSubmission[]>(),
      FormSubmission.countDocuments({ form: formId, isArchived: false }),
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

  async submitForm(formId: string, submissionData: Record<string, unknown>, ipAddress?: string) {
    await connectDB();
    const submission = await FormSubmission.create({
      form: formId,
      data: submissionData,
      ipAddress,
    });

    // Increment submission count
    await this.model.findByIdAndUpdate(formId, { $inc: { submissionCount: 1 } });
    return submission;
  }
}

export const formService = new FormService();
