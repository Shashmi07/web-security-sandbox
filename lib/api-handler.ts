import { NextResponse } from "next/server";

export function serverError(error: unknown, context: string) {
  console.error(`${context}:`, error);
  return NextResponse.json(
    { message: "An unexpected error occurred. Please try again." },
    { status: 500 }
  );
}
