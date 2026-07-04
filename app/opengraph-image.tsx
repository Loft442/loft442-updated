import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo";

export const runtime = "edge";
export const alt = `${SITE_NAME} — Luxury Event Venue in Elmont, NY`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #070708 0%, #141418 55%, #1a1810 100%)",
          color: "#ffffff",
          padding: "64px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#d4af37",
            marginBottom: 24,
          }}
        >
          Luxury Event Venue
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: "0.12em",
            lineHeight: 1,
            marginBottom: 32,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 32,
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.78)",
            maxWidth: 900,
          }}
        >
          Weddings, Repass, Corporate Events & Private Celebrations
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 24,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Elmont, NY
        </div>
      </div>
    ),
    size
  );
}
