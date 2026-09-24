import { z } from "zod";

export const updateSettingSchema = z.object({
  key: z.string().min(1),
  value: z.unknown(),
});

export const updateSettingsBatchSchema = z.object({
  settings: z.array(z.object({
    key: z.string().min(1),
    value: z.unknown(),
  })),
});
