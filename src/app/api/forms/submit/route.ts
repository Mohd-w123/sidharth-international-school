import { NextResponse } from "next/server";
import { formService } from "@/services/form.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { formId, data } = body;

    if (!formId || !data) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || undefined;
    await formService.submitForm(formId, data, ip);

    return NextResponse.json({ success: true, message: "Form submitted" });
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json({ error: "Failed to submit form" }, { status: 500 });
  }
}
