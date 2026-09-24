"use server";

import { connectDB } from "@/lib/db";
import { Page } from "@/models/page.model";
import { News } from "@/models/news.model";
import { Event } from "@/models/event.model";
import { GalleryAlbum } from "@/models/gallery-album.model";
import { Faculty } from "@/models/faculty.model";
import { User } from "@/models/user.model";
import { Media } from "@/models/media.model";
import { FormSubmission } from "@/models/form-submission.model";

export interface DashboardStats {
  pages: number;
  news: number;
  events: number;
  gallery: number;
  faculty: number;
  users: number;
  media: number;
  submissions: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await connectDB();

  const [pages, news, events, gallery, faculty, users, media, submissions] =
    await Promise.all([
      Page.countDocuments(),
      News.countDocuments(),
      Event.countDocuments(),
      GalleryAlbum.countDocuments(),
      Faculty.countDocuments(),
      User.countDocuments(),
      Media.countDocuments(),
      FormSubmission.countDocuments(),
    ]);

  return { pages, news, events, gallery, faculty, users, media, submissions };
}
