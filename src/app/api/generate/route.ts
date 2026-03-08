import { NextRequest, NextResponse } from "next/server";
import { createSession, updateSession, setSessionError } from "@/lib/session";
import { analyzePetPhoto } from "@/lib/vision";
import { buildPrompt } from "@/lib/prompt-engine";
import { generateImage } from "@/lib/image-gen";
import { saveGeneratedImage } from "@/lib/storage";
import { StyleTheme } from "@/types";

export const maxDuration = 60;

const VALID_STYLES: StyleTheme[] = [
  "royal", "knight", "astronaut", "superhero", "chef", "cowboy", "rockstar", "wizard",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("photo") as File | null;
    const style = formData.get("style") as StyleTheme | null;

    if (!file) {
      return NextResponse.json({ error: "No photo uploaded" }, { status: 400 });
    }

    if (!style || !VALID_STYLES.includes(style)) {
      return NextResponse.json({ error: "Invalid style selected" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a JPEG, PNG, or WebP image." },
        { status: 400 }
      );
    }

    const session = createSession(style);

    // Run pipeline async (don't await)
    runPipeline(session.id, file, style).catch((err) => {
      console.error(`Pipeline error for session ${session.id}:`, err);
      setSessionError(session.id, "Generation failed. Please try again.");
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Generate endpoint error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function runPipeline(sessionId: string, file: File, style: StyleTheme) {
  // Step 1: Analyze pet photo
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const petAnalysis = await analyzePetPhoto(buffer, file.type);
  updateSession(sessionId, { petAnalysis, status: "generating" });

  // Step 2: Build prompt and generate image
  const prompt = buildPrompt(style, petAnalysis);
  const imageBuffer = await generateImage(prompt);

  // Step 3: Save image
  const imageUrl = await saveGeneratedImage(sessionId, imageBuffer);
  updateSession(sessionId, { imageUrl, status: "ready" });
}
