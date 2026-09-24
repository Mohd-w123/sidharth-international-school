import { BaseService } from "@/lib/cms/base-service";
import { TransferCertificate } from "@/models/transfer-certificate.model";
import type { ITransferCertificate } from "@/models/transfer-certificate.model";

class TCService extends BaseService<ITransferCertificate> {
  constructor() {
    super(TransferCertificate, ["studentName", "admissionNumber", "tcNumber"]);
  }

  async verifyAndGetTC(admissionNumber: string, dateOfBirth: Date) {
    await this.connect();
    // Normalize DOB comparison to start/end of day
    const startDate = new Date(dateOfBirth);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(dateOfBirth);
    endDate.setHours(23, 59, 59, 999);

    return this.model.findOne({
      admissionNumber: { $regex: new RegExp(`^${admissionNumber.trim()}$`, "i") },
      dateOfBirth: { $gte: startDate, $lte: endDate },
      status: "active",
      isDeleted: { $ne: true },
    }).lean<ITransferCertificate>();
  }
}

export const tcService = new TCService();
