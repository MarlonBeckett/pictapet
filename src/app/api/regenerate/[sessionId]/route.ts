import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession, addImageToSession } from "@/lib/session";
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

  const session = getSession(sessionId);
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

  updateSession(sessionId, { generatingMore: true });

  // Run generation async
  regenerate(sessionId).catch((err) => {
    console.error(`Regenerate error for session ${sessionId}:`, err);
    updateSession(sessionId, { generatingMore: false, error: "Generation failed. Please try again." });
  });

  return NextResponse.json({ ok: true });
}

async function regenerate(sessionId: string) {
  const session = getSession(sessionId);
  if (!session || !session.petAnalysis) return;

  const prompt = buildPrompt(session.style, session.petAnalysis);
  const imageBuffer = await generateImage(prompt);

  const index = session.imageUrls.length;
  const imageUrl = await saveGeneratedImage(sessionId, imageBuffer, index);
  addImageToSession(sessionId, imageUrl);
}
