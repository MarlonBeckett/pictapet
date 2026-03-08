import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: session.status,
    imageUrls: session.imageUrls,
    purchased: process.env.BYPASS_PURCHASE === "true" ? true : session.purchased,
    generatingMore: session.generatingMore ?? false,
    error: session.error,
  });
}
