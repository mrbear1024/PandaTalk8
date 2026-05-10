"use client";

import { useState, useTransition } from "react";
import type { About, SiteSettings, Social } from "@/lib/types";

type ActionResult = { error?: string };

function socialsText(socials: Social[]) {
  return socials.map((s) => `${s.label} | ${s.handle} | ${s.href}`).join("\n");
}

function aboutText(about: About) {
  return about.sections
    .map((section) => `${section.heading}\n${section.paragraphs.join("\n\n")}`)
    .join("\n---\n");
}

function timelineText(about: About) {
  return about.timeline.map((t) => `${t.year} | ${t.what} | ${t.detail}`).join("\n");
}

function Toggle({ name, label, checked }: { name: string; label: string; checked: boolean }) {
  return (
    <label className="check-field">
      <input type="checkbox" name={name} defaultChecked={checked} />
      <span>{label}</span>
    </label>
  );
}

export default function SettingsForm({
  settings,
  action,
}: {
  settings: SiteSettings;
  action: (fd: FormData) => Promise<ActionResult>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const { site, about, home } = settings;

  return (
    <form
      className="settings-form"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setError(null);
        start(async () => {
          const res = await action(fd);
          if (res?.error) setError(res.error);
        });
      }}
    >
      {error ? <div className="alert">{error}</div> : null}

      <section className="form-card">
        <h2>Site identity</h2>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="display_name">display name</label>
            <input id="display_name" name="display_name" defaultValue={site.displayName} />
          </div>
          <div className="form-field">
            <label htmlFor="brand_name">brand name</label>
            <input id="brand_name" name="brand_name" defaultValue={site.brandName} />
          </div>
          <div className="form-field">
            <label htmlFor="site_name">site name</label>
            <input id="site_name" name="site_name" defaultValue={site.name} />
          </div>
          <div className="form-field">
            <label htmlFor="domain">domain</label>
            <input id="domain" name="domain" defaultValue={site.domain} />
          </div>
          <div className="form-field full">
            <label htmlFor="tagline">tagline</label>
            <input id="tagline" name="tagline" defaultValue={site.tagline} />
          </div>
          <div className="form-field">
            <label htmlFor="location">location</label>
            <input id="location" name="location" defaultValue={site.location} />
          </div>
          <div className="form-field">
            <label htmlFor="x_followers">X followers</label>
            <input id="x_followers" name="x_followers" defaultValue={site.xFollowers} />
          </div>
          <div className="form-field">
            <label htmlFor="x_handle">X handle</label>
            <input id="x_handle" name="x_handle" defaultValue={site.xHandle} />
          </div>
          <div className="form-field">
            <label htmlFor="x_url">X url</label>
            <input id="x_url" name="x_url" defaultValue={site.xUrl} />
          </div>
          <div className="form-field">
            <label htmlFor="wechat_name">wechat name</label>
            <input id="wechat_name" name="wechat_name" defaultValue={site.wechatName} />
          </div>
          <div className="form-field">
            <label htmlFor="wechat_qr">wechat qr</label>
            <input id="wechat_qr" name="wechat_qr" defaultValue={site.wechatQr} />
          </div>
          <div className="form-field full">
            <label htmlFor="wechat_material">wechat material</label>
            <input id="wechat_material" name="wechat_material" defaultValue={site.wechatMaterial} />
          </div>
        </div>
      </section>

      <section className="form-card">
        <h2>Home page</h2>
        <div className="form-grid">
          <div className="form-field full">
            <label htmlFor="home_kicker">kicker</label>
            <input id="home_kicker" name="home_kicker" defaultValue={home.kicker} />
          </div>
          <div className="form-field">
            <label htmlFor="home_title">title</label>
            <input id="home_title" name="home_title" defaultValue={home.title} />
          </div>
          <div className="form-field">
            <label htmlFor="home_title_accent">title accent</label>
            <input id="home_title_accent" name="home_title_accent" defaultValue={home.titleAccent} />
          </div>
          <div className="form-field full">
            <label htmlFor="home_lede">lede</label>
            <textarea id="home_lede" name="home_lede" rows={3} defaultValue={home.lede} />
          </div>
          <div className="form-field">
            <label htmlFor="primary_cta_label">primary CTA label</label>
            <input id="primary_cta_label" name="primary_cta_label" defaultValue={home.primaryCtaLabel} />
          </div>
          <div className="form-field">
            <label htmlFor="primary_cta_href">primary CTA href</label>
            <input id="primary_cta_href" name="primary_cta_href" defaultValue={home.primaryCtaHref} />
          </div>
          <div className="form-field">
            <label htmlFor="secondary_cta_label">secondary CTA label</label>
            <input id="secondary_cta_label" name="secondary_cta_label" defaultValue={home.secondaryCtaLabel} />
          </div>
          <div className="form-field">
            <label htmlFor="secondary_cta_href">secondary CTA href</label>
            <input id="secondary_cta_href" name="secondary_cta_href" defaultValue={home.secondaryCtaHref} />
          </div>
          <div className="form-field full">
            <label htmlFor="socials_title">social links title</label>
            <input id="socials_title" name="socials_title" defaultValue={home.socialsTitle} />
          </div>
          <div className="form-field">
            <label htmlFor="now_status">now status</label>
            <input id="now_status" name="now_status" defaultValue={site.now.status} />
          </div>
          <div className="form-field">
            <label htmlFor="now_text">now text</label>
            <input id="now_text" name="now_text" defaultValue={site.now.text} />
          </div>
          <div className="settings-toggles full">
            <Toggle name="show_socials" label="Show socials" checked={home.showSocials} />
            <Toggle name="show_communities" label="Show communities" checked={home.showCommunities} />
            <Toggle name="show_posts" label="Show posts" checked={home.showPosts} />
            <Toggle name="show_projects" label="Show projects" checked={home.showProjects} />
            <Toggle name="show_courses" label="Show courses" checked={home.showCourses} />
          </div>
        </div>
      </section>

      <section className="form-card">
        <h2>Social accounts</h2>
        <div className="form-field">
          <label htmlFor="socials">accounts</label>
          <textarea id="socials" name="socials" rows={8} defaultValue={socialsText(site.socials)} />
          <span className="hint">One per line: Label | Handle | URL. Delete a line to remove an account.</span>
        </div>
      </section>

      <section className="form-card">
        <h2>About page</h2>
        <div className="form-field">
          <label htmlFor="about_sections">sections</label>
          <textarea id="about_sections" name="about_sections" rows={16} defaultValue={aboutText(about)} />
          <span className="hint">Format: heading on first line, paragraphs after it. Separate sections with --- on its own line.</span>
        </div>
        <div className="form-field">
          <label htmlFor="timeline">timeline</label>
          <textarea id="timeline" name="timeline" rows={8} defaultValue={timelineText(about)} />
          <span className="hint">One per line: Year | What | Detail</span>
        </div>
      </section>

      <div className="form-actions">
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
