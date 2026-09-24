import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/session";
import { mediaService } from "@/services/media.service";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { ALL_ALLOWED_TYPES, MAX_FILE_SIZE } from "@/lib/validations/media";

export async function POST(req: Request) {
  try {
    let session;
    try {
      session = await requirePermission("media.upload");
    } catch {
      return NextResponse.json({ error: "Unauthorized: Permission denied" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALL_ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 25MB size limit" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const resourceType = file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : "raw";
    const folder = (formData.get("folder") as string) || "school-cms";

    const result = await uploadToCloudinary(buffer, {
      folder,
      resourceType,
      filename: file.name,
    });

    const media = await mediaService.create({
      filename: file.name,
      originalName: file.name,
      url: result.secureUrl,
      publicId: result.publicId,
      mimeType: file.type,
      size: result.size,
      width: result.width,
      height: result.height,
      folder,
      alt: (formData.get("alt") as string) || undefined,
      caption: (formData.get("caption") as string) || undefined,
      tags: formData.get("tags") ? (formData.get("tags") as string).split(",").map((t) => t.trim()) : [],
      uploadedBy: session.user.id,
    } as never);

    return NextResponse.json({ success: "File uploaded successfully", id: media._id.toString(), url: media.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    console.error("API Upload error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
