import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get("url");
    const rawName = searchParams.get("name") || "document";

    if (!targetUrl) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    // Determine target file extension
    let ext = ".pdf";
    const lowerUrl = targetUrl.toLowerCase();
    if (lowerUrl.endsWith(".docx")) ext = ".docx";
    else if (lowerUrl.endsWith(".doc")) ext = ".doc";
    else if (lowerUrl.endsWith(".xlsx")) ext = ".xlsx";
    else if (lowerUrl.endsWith(".xls")) ext = ".xls";
    else if (lowerUrl.endsWith(".png")) ext = ".png";
    else if (lowerUrl.endsWith(".jpg") || lowerUrl.endsWith(".jpeg")) ext = ".jpg";
    else if (lowerUrl.endsWith(".webp")) ext = ".webp";

    let cleanName = rawName
      .replace(/[^a-zA-Z0-9_.\-\s]/g, "")
      .trim()
      .replace(/\s+/g, "_")
      .replace(/_+/g, "_");

    if (!cleanName.toLowerCase().endsWith(ext)) {
      cleanName = `${cleanName}${ext}`;
    }

    // Resolve relative local URLs if needed
    let fetchUrl = targetUrl;
    if (targetUrl.startsWith("/")) {
      const origin = req.nextUrl.origin;
      fetchUrl = `${origin}${targetUrl}`;
    }

    const res = await fetch(fetchUrl);
    if (!res.ok) {
      return NextResponse.redirect(fetchUrl);
    }

    const contentType = res.headers.get("content-type") || "application/pdf";
    const headers = new Headers();
    headers.set(
      "Content-Disposition",
      `attachment; filename="${cleanName}"; filename*=UTF-8''${encodeURIComponent(cleanName)}`
    );
    headers.set("Content-Type", contentType);

    const contentLength = res.headers.get("content-length");
    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    return new NextResponse(res.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Download proxy error:", error);
    const targetUrl = new URL(req.url).searchParams.get("url");
    if (targetUrl) {
      return NextResponse.redirect(targetUrl);
    }
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 });
  }
}
