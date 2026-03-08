import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getOriginalImage } from "@/lib/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const { searchParams } = new URL(request.url);
  const index = parseInt(searchParams.get("index") || "0", 10);

  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (!session.purchased && process.env.BYPASS_PURCHASE !== "true") {
    return NextResponse.json({ error: "Purchase required" }, { status: 403 });
  }

  if (isNaN(index) || index < 0 || index >= session.imageUrls.length) {
    return NextResponse.json({ error: "Invalid image index" }, { status: 400 });
  }

  const imageBuffer = await getOriginalImage(sessionId, index);
  if (!imageBuffer) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(imageBuffer), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="pictapet-portrait-${index + 1}.png"`,
    },
  });
}
