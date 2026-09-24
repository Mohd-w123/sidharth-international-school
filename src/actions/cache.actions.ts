"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function clearAppCache(): Promise<{ success?: string; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized. Please log in first." };
    }

    // Invalidate entire public website cache & layout trees
    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");

    return {
      success: "Website cache cleared successfully! All pages and menus have been refreshed.",
    };
  } catch (error) {
    console.error("Failed to clear cache:", error);
    return { error: "Failed to clear cache. Please try again." };
  }
}
