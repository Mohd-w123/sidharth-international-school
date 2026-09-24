import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(error: string, status = 400): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error }, { status });
}

export function handleApiError(err: unknown): NextResponse<ApiResponse> {
  console.error("API error:", err);

  if (err instanceof Error) {
    if (err.name === "ValidationError") {
      return errorResponse(err.message, 400);
    }
    if (err.name === "CastError") {
      return errorResponse("Invalid ID format", 400);
    }
  }

  return errorResponse("Internal server error", 500);
}
