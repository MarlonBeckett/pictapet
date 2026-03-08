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

  const purchasedIndices =
    process.env.BYPASS_PURCHASE === "true"
      ? Array.from({ length: session.imageUrls.length }, (_, i) => i)
      : session.purchasedIndices;

  return NextResponse.json({
    status: session.status,
    imageUrls: session.imageUrls,
    purchasedIndices,
    generatingMore: session.generatingMore ?? false,
    error: session.error,
  });
}
