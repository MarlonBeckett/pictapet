import { NextRequest, NextResponse } from "next/server";
import { validateAdminAuth } from "@/lib/admin-auth";
import { getAdminBatchSession, addAdminBatchImage, addAdminBatchFailure } from "@/lib/admin-session";
import { buildPrompt } from "@/lib/prompt-engine";
import { generateImage } from "@/lib/image-gen";
import { saveAdminImage } from "@/lib/admin-storage";
import { StyleTheme } from "@/types";
import { THEMES } from "@/lib/themes";

export const maxDuration = 60;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  if (!validateAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { batchId } = await params;
  const body = await request.json();
  const { theme, subRole } = body as { theme: string; subRole: string };

  if (!theme || !subRole) {
    return NextResponse.json({ error: "theme and subRole required" }, { status: 400 });
  }

  const themeConfig = THEMES[theme as StyleTheme];
  if (!themeConfig) {
    return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
  }

  const validSubRoles = themeConfig.subRoles.map((sr) => sr.id);
  if (!validSubRoles.includes(subRole)) {
    return NextResponse.json({ error: "Invalid subRole" }, { status: 400 });
  }

  const session = await getAdminBatchSession(batchId);
  if (!session) {
    return NextResponse.json({ error: "Batch session not found" }, { status: 404 });
  }

  try {
    const prompt = buildPrompt(theme as StyleTheme, session.petAnalysis, subRole);
    const imageBuffer = await generateImage(prompt, {
      data: session.photoBase64,
      mimeType: session.photoMimeType,
    });

    const imageUrl = await saveAdminImage(batchId, theme, subRole, imageBuffer);

    await addAdminBatchImage(batchId, {
      theme,
      subRole,
      imageUrl,
      originalPath: `${batchId}-${theme}-${subRole}.png`,
    });

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error(`Admin generate error for ${batchId} ${theme}/${subRole}:`, error);
    await addAdminBatchFailure(batchId, {
      theme,
      subRole,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
