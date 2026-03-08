import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession, addImageAndOriginalToSession } from "@/lib/session";
import { buildPrompt } from "@/lib/prompt-engine";
import { generateImage } from "@/lib/image-gen";
import { saveGeneratedImage } from "@/lib/storage";

export const maxDuration = 60;

const MAX_IMAGES = 5;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  const session = await getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.status !== "ready") {
    return NextResponse.json({ error: "Session is not ready" }, { status: 400 });
  }

  if (session.generatingMore) {
    return NextResponse.json({ error: "Already generating" }, { status: 400 });
  }

  if (session.imageUrls.length >= MAX_IMAGES) {
    return NextResponse.json({ error: "Maximum images reached" }, { status: 400 });
  }

  if (!session.petAnalysis) {
    return NextResponse.json({ error: "No pet analysis available" }, { status: 400 });
  }

  await updateSession(sessionId, { generatingMore: true });

  // Run generation async
  regenerate(sessionId).catch((err) => {
    console.error(`Regenerate error for session ${sessionId}:`, err);
    updateSession(sessionId, { generatingMore: false, error: "Generation failed. Please try again." });
  });

  return NextResponse.json({ ok: true });
}

async function regenerate(sessionId: string) {
  const session = await getSession(sessionId);
  if (!session || !session.petAnalysis) return;

  const prompt = buildPrompt(session.style, session.petAnalysis, session.subRole);

  const referenceImage = session.originalPhotoBase64 && session.originalPhotoMimeType
    ? { data: session.originalPhotoBase64, mimeType: session.originalPhotoMimeType }
    : undefined;

  const imageBuffer = await generateImage(prompt, referenceImage);

  const index = session.imageUrls.length;
  const { watermarkedUrl, originalPath } = await saveGeneratedImage(sessionId, imageBuffer, index);
  await addImageAndOriginalToSession(sessionId, watermarkedUrl, originalPath);
}
