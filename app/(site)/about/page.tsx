import { Fragment } from "react";
import Socials from "@/components/Socials";
import WechatPromo from "@/components/WechatPromo";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = {
  title: "About · PandaTalk8",
  description: "A pixel panda in glasses and a hoodie — and how he got here.",
};

function renderPara(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export default async function AboutPage() {
  const { site, about } = await getSiteSettings();

  return (
    <div className="route-enter container">
      <section className="page-intro">
        <div>
          <div className="num">§ 05 — about</div>
          <h1>
            About
            <br />
            <span className="serif" style={{ fontStyle: "italic", color: "var(--panda-red-deep)" }}>
              me
            </span>
          </h1>
        </div>
        <div className="side">A pixel panda in glasses and a hoodie — and how he got here.</div>
      </section>

      <div className="about-grid">
        <aside className="side">
          <div className="about-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/panda-avatar.png" alt="Panda avatar" />
            <div className="name">Mr Panda</div>
            <div className="handle">{site.xHandle} · he/him</div>
            <div className="stats">
              <div className="row">
                <span className="k">location</span>
                <span className="v">{site.location}</span>
              </div>
              <div className="row">
                <span className="k">status</span>
                <span className="v" style={{ color: "var(--bamboo-deep)" }}>
                  ●&nbsp; open to chat
                </span>
              </div>
              <div className="row">
                <span className="k">years coding</span>
                <span className="v">12</span>
              </div>
              <div className="row">
                <span className="k">years solo</span>
                <span className="v">1</span>
              </div>
              <div className="row">
                <span className="k">coffee/day</span>
                <span className="v">3 ☕</span>
              </div>
              <div className="row">
                <span className="k">X followers</span>
                <span className="v">{site.xFollowers}</span>
              </div>
              <div className="row" id="wechat">
                <span className="k">公众号</span>
                <span className="v">{site.wechatName}</span>
              </div>
              <div className="row">
                <span className="k">learning group</span>
                <span className="v">12K members</span>
              </div>
            </div>
            <Socials />
          </div>
        </aside>
        <div className="main">
          <WechatPromo />
          <div className="prose">
            {about.sections.map((s, i) => (
              <Fragment key={i}>
                <h2>{s.heading}</h2>
                {s.paragraphs.map((p, j) => (
                  <p key={j}>{renderPara(p)}</p>
                ))}
              </Fragment>
            ))}
            <h2>Timeline</h2>
            <ul className="timeline">
              {about.timeline.map((t, i) => (
                <li key={i}>
                  <span className="year">{t.year}</span>
                  <span className="what">
                    {t.what}
                    <span className="detail">{t.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
