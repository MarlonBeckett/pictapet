import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GOOGLE_GENAI_API_KEY;

if (!apiKey) {
  throw new Error("GOOGLE_GENAI_API_KEY environment variable is required");
}

export const genai = new GoogleGenAI({ apiKey });
