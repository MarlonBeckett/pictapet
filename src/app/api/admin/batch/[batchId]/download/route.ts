import { NextRequest, NextResponse } from "next/server";
import { validateAdminAuth } from "@/lib/admin-auth";
import { getAdminBatchSession } from "@/lib/admin-session";
import { getAdminImage } from "@/lib/admin-storage";
import { THEMES } from "@/lib/themes";
import { StyleTheme } from "@/types";
import JSZip from "jszip";

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

  const zip = new JSZip();
  let count = 0;

  // Scan all theme+subRole combos directly from storage instead of relying
  // on session.images (which can lose entries due to concurrent write races)
  const themeKeys = Object.keys(THEMES) as StyleTheme[];
  for (const theme of themeKeys) {
    const config = THEMES[theme];
    for (const sr of config.subRoles) {
      const buffer = await getAdminImage(batchId, theme, sr.id);
      if (buffer) {
        zip.file(`${theme}-${sr.id}.png`, buffer);
        count++;
      }
    }
  }

  if (count === 0) {
    return NextResponse.json({ error: "No images to download" }, { status: 400 });
  }

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  return new NextResponse(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="pictapet-batch-${batchId.slice(0, 8)}.zip"`,
    },
  });
}
