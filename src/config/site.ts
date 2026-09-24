export const siteConfig = {
  defaultPageSize: 10,
  maxPageSize: 100,
  maxUploadSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
  allowedDocTypes: ["application/pdf"],
} as const;
