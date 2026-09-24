export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function ensureUniqueSlug(
  slug: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  let candidate = slug;
  let counter = 1;

  while (await checkExists(candidate)) {
    candidate = `${slug}-${counter}`;
    counter++;
    if (counter > 100) throw new Error("Unable to generate unique slug");
  }

  return candidate;
}
