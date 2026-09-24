"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/session";
import { eventService } from "@/services/event.service";
import { createEventSchema, updateEventSchema } from "@/lib/validations/event";
import { parseSearchParams, type ActionState } from "@/lib/cms";

export async function getEvents(searchParams: Record<string, string | string[] | undefined>) {
  await requirePermission("events.view");
  const params = parseSearchParams(searchParams);
  return eventService.findPaginated(params);
}

export async function getEventById(id: string) {
  await requirePermission("events.view");
  return eventService.findById(id);
}

export async function createEvent(data: unknown): Promise<ActionState & { id?: string }> {
  const session = await requirePermission("events.create");
  const parsed = createEventSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };

  const slug = await eventService.generateUniqueSlug(parsed.data.title);
  const event = await eventService.create({
    ...parsed.data,
    slug: parsed.data.slug || slug,
    createdBy: session.user.id,
    updatedBy: session.user.id,
  } as never);

  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { success: "Event created", id: event._id.toString() };
}

export async function updateEvent(data: unknown): Promise<ActionState> {
  const session = await requirePermission("events.update");
  const parsed = updateEventSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };

  const { id, ...updateData } = parsed.data;
  await eventService.update(id, { ...updateData, updatedBy: session.user.id } as never);
  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { success: "Event updated" };
}

export async function publishEvent(id: string): Promise<ActionState> {
  const session = await requirePermission("events.publish");
  await eventService.publish(id, session.user.id);
  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { success: "Event published" };
}

export async function unpublishEvent(id: string): Promise<ActionState> {
  const session = await requirePermission("events.publish");
  await eventService.unpublish(id, session.user.id);
  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { success: "Event unpublished" };
}

export async function deleteEvent(id: string): Promise<ActionState> {
  const session = await requirePermission("events.delete");
  await eventService.softDelete(id, session.user.id);
  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { success: "Event deleted" };
}

export async function bulkDeleteEvents(ids: string[]): Promise<ActionState> {
  const session = await requirePermission("events.delete");
  await eventService.bulkDelete(ids, session.user.id);
  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/", "layout");
  return { success: `${ids.length} event(s) deleted` };
}
