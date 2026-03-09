import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const alt = "PictaPet — AI Pet Portraits Worthy of a Frame";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #c8a55c 0%, #c4713b 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Paw icon — matches favicon: 3 toes + 1 pad */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <svg
            width="110"
            height="100"
            viewBox="0 0 64 54"
            fill="none"
          >
            {/* Toes */}
            <ellipse cx="12" cy="14" rx="7" ry="8" fill="white" />
            <ellipse cx="32" cy="8" rx="7" ry="8" fill="white" />
            <ellipse cx="52" cy="14" rx="7" ry="8" fill="white" />
            {/* Pad */}
            <ellipse cx="32" cy="38" rx="14" ry="12" fill="white" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "white",
            letterSpacing: "-2px",
            lineHeight: 1,
            marginBottom: 12,
          }}
        >
          PictaPet
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 30,
            color: "rgba(255, 255, 255, 0.85)",
            fontWeight: 400,
            letterSpacing: "2px",
            textTransform: "uppercase" as const,
          }}
        >
          Portraits Worthy of a Frame
        </div>
      </div>
    ),
    { ...size }
  );
}
