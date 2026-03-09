import { NextRequest, NextResponse } from "next/server";
import { getWatermarkedImage } from "@/lib/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  const imageBuffer = await getWatermarkedImage(filename);
  if (!imageBuffer) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(imageBuffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
