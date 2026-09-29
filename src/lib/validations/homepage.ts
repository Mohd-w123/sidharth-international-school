import { z } from "zod";

export const homepageSectionSchema = z.object({
  _id: z.string().optional(),
  type: z.string().min(1, "Section type is required"),
  title: z.string().optional(),
  content: z.record(z.unknown()).default({}),
  isEnabled: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const homepageConfigSchema = z.object({
  sections: z.array(homepageSectionSchema).default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export type HomepageSectionInput = z.infer<typeof homepageSectionSchema>;
export type HomepageConfigInput = z.infer<typeof homepageConfigSchema>;

export const SECTION_TYPES = [
  { value: "hero", label: "Hero Banner" },
  { value: "announcement", label: "Announcement" },
  { value: "introduction", label: "Introduction" },
  { value: "academics", label: "Academics" },
  { value: "vision", label: "Vision & Philosophy" },
  { value: "why-choose-us", label: "Why Choose Us" },
  { value: "amenities", label: "Amenities" },
  { value: "facilities", label: "Facilities" },
  { value: "school-life", label: "School Life (Sports & Activities)" },
  { value: "student-development", label: "Student Development" },
  { value: "manifesto", label: "School Manifesto" },
  { value: "director-message", label: "Director's Desk" },
  { value: "chairman-message", label: "Chairman Message" },
  { value: "principal-message", label: "Principal Message" },
  { value: "statistics", label: "Statistics" },
  { value: "programs", label: "Programs" },
  { value: "achievements", label: "Achievements" },
  { value: "news", label: "Latest News" },
  { value: "events", label: "Upcoming Events" },
  { value: "gallery", label: "Photo Gallery" },
  { value: "video", label: "Video Section" },
  { value: "testimonials", label: "Testimonials" },
  { value: "cta", label: "Call to Action" },
  { value: "faq", label: "FAQ" },
  { value: "contact-cta", label: "Contact CTA" },
  { value: "regional-overview", label: "Regional Overview" },
] as const;

export type SectionType = (typeof SECTION_TYPES)[number]["value"];
