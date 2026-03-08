import { NextRequest, NextResponse } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const heicConvert = require("heic-convert");
import { createSession, updateSession, setSessionError } from "@/lib/session";
import { analyzePetPhoto } from "@/lib/vision";
import { buildPrompt } from "@/lib/prompt-engine";
import { generateImage } from "@/lib/image-gen";
import { saveGeneratedImage } from "@/lib/storage";
import { StyleTheme } from "@/types";
import { THEMES } from "@/lib/themes";

export const maxDuration = 60;

const VALID_STYLES: StyleTheme[] = ["royal", "cowboy", "beach"];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("photo") as File | null;
    const style = formData.get("style") as StyleTheme | null;
    const subRole = formData.get("subRole") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No photo uploaded" }, { status: 400 });
    }

    if (!style || !VALID_STYLES.includes(style)) {
      return NextResponse.json({ error: "Invalid style selected" }, { status: 400 });
    }

    // Validate sub-role if provided
    if (subRole) {
      const theme = THEMES[style];
      const validSubRoles = theme.subRoles.map((sr) => sr.id);
      if (!validSubRoles.includes(subRole)) {
        return NextResponse.json({ error: "Invalid sub-role selected" }, { status: 400 });
      }
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
    let detectedMimeType = file.type;
    if (!validTypes.includes(detectedMimeType)) {
      const ext = file.name.toLowerCase().match(/\.\w+$/)?.[0];
      if (ext === ".heic" || ext === ".heif") {
        detectedMimeType = "image/heic";
      } else {
        return NextResponse.json(
          { error: "Invalid file type. Please upload a JPEG, PNG, WebP, or HEIC image." },
          { status: 400 }
        );
      }
    }

    const session = createSession(style, subRole || undefined);

    // Run pipeline async (don't await)
    runPipeline(session.id, file, style, detectedMimeType, subRole || undefined).catch((err) => {
      console.error(`Pipeline error for session ${session.id}:`, err);
      setSessionError(session.id, "Generation failed. Please try again.");
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Generate endpoint error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function runPipeline(sessionId: string, file: File, style: StyleTheme, detectedMimeType: string, subRole?: string) {
  // Step 1: Analyze pet photo
  const arrayBuffer = await file.arrayBuffer();
  let buffer = Buffer.from(arrayBuffer);
  let mimeType = detectedMimeType;

  // Convert HEIC/HEIF to JPEG since Gemini doesn't support these formats
  if (mimeType === "image/heic" || mimeType === "image/heif") {
    buffer = Buffer.from(await heicConvert({ buffer, format: "JPEG", quality: 0.9 }));
    mimeType = "image/jpeg";
  }

  const base64Photo = buffer.toString("base64");

  const petAnalysis = await analyzePetPhoto(buffer, mimeType);
  updateSession(sessionId, { petAnalysis, status: "generating" });

  // Store original photo on session for regeneration
  const { getSession: getSessionDirect } = await import("@/lib/session");
  const sessionObj = getSessionDirect(sessionId);
  if (sessionObj) {
    sessionObj.originalPhotoBase64 = base64Photo;
    sessionObj.originalPhotoMimeType = mimeType;
  }

  // Step 2: Build prompt and generate image with reference photo
  const prompt = buildPrompt(style, petAnalysis, subRole);
  const imageBuffer = await generateImage(prompt, {
    data: base64Photo,
    mimeType: mimeType,
  });

  // Step 3: Save image (watermarked public + original private)
  const { watermarkedUrl, originalPath } = await saveGeneratedImage(sessionId, imageBuffer, 0);
  updateSession(sessionId, {
    imageUrls: [watermarkedUrl],
    status: "ready",
  });

  // Store original path directly on session
  const { getSession } = await import("@/lib/session");
  const session = getSession(sessionId);
  if (session) {
    session.originalImagePaths = [originalPath];
  }
}
