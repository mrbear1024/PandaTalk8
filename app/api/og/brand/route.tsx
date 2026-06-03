import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const avatar = `${origin}/assets/panda-avatar.png`;

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
            padding: "44px 64px",
            border: "2px solid #cfc3aa",
            borderRadius: 28,
            background: "#fbf6ea",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 36,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div
                style={{
                  width: 84,
                  height: 84,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "3px solid #1f1d1a",
                  borderRadius: 999,
                  background: "#efe6d3",
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatar} alt="" width={110} height={110} style={{ objectFit: "cover" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 40, lineHeight: 0.95, letterSpacing: "-0.02em" }}>Mr Panda</div>
                <div
                  style={{
                    color: "#766f64",
                    fontFamily: "Arial, sans-serif",
                    fontSize: 18,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  AI Builder · Indie Maker
                </div>
              </div>
            </div>
            <div
              style={{
                padding: "13px 18px",
                border: "1px solid #cfc3aa",
                borderRadius: 999,
                color: "#766f64",
                fontFamily: "Arial, sans-serif",
                fontSize: 18,
                letterSpacing: "0.08em",
              }}
            >
              @PandaTalk8
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 64 }}>
            <div style={{ display: "flex", flexDirection: "column", width: 700 }}>
              <div style={{ display: "flex", flexDirection: "column", fontSize: 70, lineHeight: 0.98, letterSpacing: "-0.035em" }}>
                <span>AI builder &</span>
                <span style={{ color: "#b44927", fontStyle: "italic" }}>indie founder.</span>
              </div>
              <div
                style={{
                  marginTop: 24,
                  color: "#3f3932",
                  fontSize: 28,
                  lineHeight: 1.28,
                }}
              >
                Building products, writing ideas, and selling myself in public.
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  marginTop: 28,
                  color: "#766f64",
                  fontFamily: "Arial, sans-serif",
                  fontSize: 20,
                }}
              >
                <span style={{ width: 11, height: 11, borderRadius: 999, background: "#24643f" }} />
                <strong>75K followers on X</strong>
                <span>·</span>
                <span>公众号 PandaTalk8</span>
              </div>
            </div>

            <div
              style={{
                width: 290,
                display: "flex",
                flexDirection: "column",
                padding: "26px 26px 24px",
                border: "3px solid #1f1d1a",
                borderRadius: 18,
                background: "#f3ead8",
              }}
            >
              <div
                style={{
                  color: "#b44927",
                  fontFamily: "Arial, sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                PandaTalk8
              </div>
              <div style={{ marginTop: 12, fontSize: 32, lineHeight: 1, letterSpacing: "-0.02em" }}>
                Build in public.
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 11,
                  marginTop: 20,
                  paddingTop: 18,
                  borderTop: "1px dashed #cfc3aa",
                  color: "#3f3932",
                  fontFamily: "Arial, sans-serif",
                  fontSize: 18,
                  lineHeight: 1.1,
                }}
              >
                {["AI products", "X growth", "Paid communities", "Long-form articles"].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: "#24643f" }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 20,
                  padding: "10px 14px",
                  border: "1px dashed #cfc3aa",
                  color: "#766f64",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Arial, sans-serif",
                  fontSize: 17,
                  letterSpacing: "0.06em",
                }}
              >
                pandatalk8.com
              </div>
            </div>
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
