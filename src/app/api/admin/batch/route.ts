import { NextRequest, NextResponse } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const heicConvert = require("heic-convert");
import { validateAdminAuth } from "@/lib/admin-auth";
import { analyzePetPhoto } from "@/lib/vision";
import { createAdminBatchSession } from "@/lib/admin-session";
import { THEMES } from "@/lib/themes";
import { StyleTheme } from "@/types";

export const maxDuration = 60;

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  if (!validateAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("photo") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No photo uploaded" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
    let mimeType = file.type;
    if (!validTypes.includes(mimeType)) {
      const ext = file.name.toLowerCase().match(/\.\w+$/)?.[0];
      if (ext === ".heic" || ext === ".heif") {
        mimeType = "image/heic";
      } else {
        return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
      }
    }

    const arrayBuffer = await file.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);

    if (mimeType === "image/heic" || mimeType === "image/heif") {
      buffer = Buffer.from(await heicConvert({ buffer, format: "JPEG", quality: 0.9 }));
      mimeType = "image/jpeg";
    }

    const base64Photo = buffer.toString("base64");
    const petAnalysis = await analyzePetPhoto(buffer, mimeType);

    const session = await createAdminBatchSession(base64Photo, mimeType, petAnalysis);

    // Build all theme/subRole combinations
    const combinations: { theme: string; subRole: string; themeName: string; subRoleName: string }[] = [];
    for (const themeId of Object.keys(THEMES) as StyleTheme[]) {
      const theme = THEMES[themeId];
      for (const sr of theme.subRoles) {
        combinations.push({
          theme: themeId,
          subRole: sr.id,
          themeName: theme.name,
          subRoleName: sr.name,
        });
      }
    }

    return NextResponse.json({
      batchId: session.id,
      petAnalysis,
      combinations,
    });
  } catch (error) {
    console.error("Admin batch start error:", error);
    return NextResponse.json({ error: "Failed to analyze photo" }, { status: 500 });
  }
}
