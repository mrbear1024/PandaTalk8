import { ImageResponse } from "next/og";

function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const avatar = `${origin}/assets/panda-avatar.png`;
  const title = truncate(url.searchParams.get("title") || "PandaTalk8 Article", 82);
  const tag = truncate(url.searchParams.get("tag") || "Article", 24);
  const excerpt = truncate(
    url.searchParams.get("excerpt") ||
      "Long-form notes on indie building, AI, and learning to make things in public.",
    128
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f1e5",
          color: "#1f1d1a",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            width: 1120,
            height: 550,
            display: "flex",
            flexDirection: "column",
            padding: "54px 64px",
            border: "2px solid #cfc3aa",
            borderRadius: 28,
            background: "#fbf6ea",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                color: "#766f64",
                fontFamily: "Arial, sans-serif",
                fontSize: 19,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: 999, background: "#b44927" }} />
              <span>{tag}</span>
              <span>·</span>
              <span>PandaTalk8</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <div style={{ fontSize: 28, lineHeight: 1 }}>Mr Panda</div>
                <div
                  style={{
                    marginTop: 6,
                    color: "#766f64",
                    fontFamily: "Arial, sans-serif",
                    fontSize: 16,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  @PandaTalk8
                </div>
              </div>
              <div
                style={{
                  width: 68,
                  height: 68,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #1f1d1a",
                  borderRadius: 999,
                  background: "#efe6d3",
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatar} alt="" width={88} height={88} style={{ objectFit: "cover" }} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", maxWidth: 920 }}>
              <div
                style={{
                  color: "#b44927",
                  fontFamily: "Arial, sans-serif",
                  fontSize: 22,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 24,
                }}
              >
                Article
              </div>
              <div style={{ fontSize: 68, lineHeight: 1.05, letterSpacing: "-0.035em" }}>{title}</div>
              <div
                style={{
                  marginTop: 28,
                  color: "#4f473e",
                  fontSize: 29,
                  lineHeight: 1.34,
                }}
              >
                {excerpt}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 20,
              borderTop: "1px solid #d8ceb9",
              color: "#766f64",
              fontFamily: "Arial, sans-serif",
              fontSize: 20,
            }}
          >
            <span>AI · Indie · Builder</span>
            <span>pandatalk8.com</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
