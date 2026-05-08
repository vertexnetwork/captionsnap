import { ImageResponse } from "next/og";
import { decode } from "@/lib/share";
import { getPlacement, DEFAULT_PLACEMENT_ID } from "@/lib/platform-specs";
import { truncatePlacement } from "@/lib/truncate";

export const runtime = "edge";

const W = 1200;
const H = 630;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const s = url.searchParams.get("s");
  const state = decode(s) ?? {
    v: 1 as const,
    placementId: DEFAULT_PLACEMENT_ID,
    fields: {
      primary: "Stop guessing where your ad copy gets cut off.",
      headline: "See exactly where your ad cuts off",
      description: "Free · No signup",
    },
  };
  const placement = getPlacement(state.placementId) ?? getPlacement(DEFAULT_PLACEMENT_ID)!;
  const tr = truncatePlacement(state.fields, placement);

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          display: "flex",
          background: "linear-gradient(135deg,#07070a 0%, #0e0e15 100%)",
          color: "white",
          fontFamily: "Inter, system-ui",
          padding: "48px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  background: "#00ffa3",
                  borderRadius: 4,
                  boxShadow: "0 0 24px #00ffa3",
                }}
              />
              <span style={{ color: "#a3a3b2", fontSize: 18, letterSpacing: 1 }}>CAPTIONSNAP</span>
            </div>
            <div style={{ marginTop: 24, fontSize: 30, color: "#a3a3b2" }}>
              {placement.label}
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 56,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: -1,
                maxWidth: 620,
              }}
            >
              {tr.headline?.display || tr.caption?.display || "Stop ad copy from getting truncated."}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {tr.primary?.display ? (
              <div style={{ fontSize: 22, color: "#cdcde0", maxWidth: 620 }}>
                {tr.primary.display.slice(0, 220)}
              </div>
            ) : null}
            <div style={{ fontSize: 18, color: "#00ffa3" }}>captionsnap.io</div>
          </div>
        </div>
        {/* Phone preview */}
        <div
          style={{
            display: "flex",
            width: 360,
            height: 540,
            borderRadius: 36,
            border: "2px solid #1f1f29",
            background: "linear-gradient(135deg,#181826,#272745,#0e0e1a)",
            position: "relative",
            overflow: "hidden",
            marginLeft: 48,
          }}
        >
          {/* Safe zones overlay */}
          {placement.safeZones.map((z, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${z.x}%`,
                top: `${z.y}%`,
                width: `${z.w}%`,
                height: `${z.h}%`,
                background: "rgba(255,61,110,0.22)",
                outline: "1px solid rgba(255,61,110,0.7)",
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              bottom: 18,
              left: 18,
              right: 80,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              fontSize: 14,
              color: "white",
            }}
          >
            <span style={{ fontWeight: 700 }}>{placement.platform === "tiktok" ? "@brand" : "Sponsored"}</span>
            <span style={{ opacity: 0.85, lineHeight: 1.25 }}>
              {(tr.caption?.display || tr.primary?.display || "").slice(0, 140)}
            </span>
          </div>
        </div>
      </div>
    ),
    { width: W, height: H },
  );
}
