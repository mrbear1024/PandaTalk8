"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { Project } from "@/lib/types";

type ActionResult = { error?: string };

export default function ProjectForm({
  initial,
  action,
  submitLabel,
}: {
  initial?: Project | null;
  action: (fd: FormData) => Promise<ActionResult>;
  submitLabel: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      className="form-card"
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

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="slug">slug</label>
          <input
            id="slug"
            name="slug"
            required
            pattern="[a-z0-9-]+"
            defaultValue={initial?.slug ?? ""}
          />
        </div>
        <div className="form-field">
          <label htmlFor="glyph">glyph</label>
          <input
            id="glyph"
            name="glyph"
            required
            maxLength={4}
            defaultValue={initial?.glyph ?? ""}
            placeholder="P/"
          />
          <span className="hint">2–3 chars, mono. eg. P/, ¶/, ✉/, &gt;_</span>
        </div>

        <div className="form-field full">
          <label htmlFor="title">title</label>
          <input id="title" name="title" required defaultValue={initial?.title ?? ""} />
        </div>

        <div className="form-field full">
          <label htmlFor="description">short description</label>
          <textarea
            id="description"
            name="description"
            required
            rows={2}
            style={{ minHeight: "70px" }}
            defaultValue={initial?.description ?? ""}
          />
        </div>

        <div className="form-field full">
          <label htmlFor="cover">cover image url</label>
          <input id="cover" name="cover" defaultValue={initial?.cover ?? ""} placeholder="https://…" />
        </div>

        <div className="form-field">
          <label htmlFor="status">status</label>
          <select id="status" name="status" defaultValue={initial?.status ?? "ship"}>
            <option value="ship">ship · shipped</option>
            <option value="wip">wip · in progress</option>
            <option value="idea">idea</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="status_label">status label</label>
          <input
            id="status_label"
            name="status_label"
            required
            placeholder="Live / In progress / Idea"
            defaultValue={initial?.status_label ?? ""}
          />
        </div>

        <div className="form-field">
          <label htmlFor="year">year</label>
          <input id="year" name="year" required defaultValue={initial?.year ?? ""} placeholder="2026" />
        </div>
        <div className="form-field">
          <label htmlFor="href">external link</label>
          <input id="href" name="href" defaultValue={initial?.href ?? "#"} placeholder="https://…" />
        </div>

        <div className="form-field">
          <label htmlFor="cta_label">CTA label</label>
          <input id="cta_label" name="cta_label" defaultValue={initial?.cta_label ?? ""} placeholder="Open / Join waitlist" />
        </div>
        <div className="form-field">
          <label htmlFor="cta_href">CTA link</label>
          <input id="cta_href" name="cta_href" defaultValue={initial?.cta_href ?? ""} placeholder="https://…" />
        </div>

        <div className="form-field">
          <label htmlFor="sort_order">sort order</label>
          <input id="sort_order" name="sort_order" type="number" defaultValue={initial?.sort_order ?? 100} />
        </div>
        <label className="check-field" style={{ alignSelf: "end" }}>
          <input type="checkbox" name="featured" defaultChecked={!!initial?.featured} />
          <span>Featured</span>
        </label>

        <div className="form-field full">
          <label htmlFor="stack">stack</label>
          <input
            id="stack"
            name="stack"
            defaultValue={(initial?.stack ?? []).join(", ")}
            placeholder="Next.js, Claude, Stripe"
          />
          <span className="hint">comma-separated</span>
        </div>

        <div className="form-field full">
          <label htmlFor="audience">audience</label>
          <textarea
            id="audience"
            name="audience"
            rows={3}
            defaultValue={initial?.audience ?? ""}
            placeholder="Who this is for"
          />
        </div>

        <div className="form-field full">
          <label htmlFor="long">long description</label>
          <textarea
            id="long"
            name="long"
            required
            rows={8}
            defaultValue={initial?.long ?? ""}
          />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "saving…" : submitLabel}
        </button>
        <Link href="/admin/projects" className="btn ghost">
          cancel
        </Link>
      </div>
    </form>
  );
}
