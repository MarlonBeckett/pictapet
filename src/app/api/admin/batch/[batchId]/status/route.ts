import { NextRequest, NextResponse } from "next/server";
import { validateAdminAuth } from "@/lib/admin-auth";
import { getAdminBatchSession } from "@/lib/admin-session";

export const maxDuration = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  if (!validateAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { batchId } = await params;
  const session = await getAdminBatchSession(batchId);

  if (!session) {
    return NextResponse.json({ error: "Batch session not found" }, { status: 404 });
  }

  return NextResponse.json({
    batchId: session.id,
    images: session.images,
    failures: session.failures,
    complete: session.complete,
    createdAt: session.createdAt,
  });
}
