"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { Community } from "@/lib/types";

type ActionResult = { error?: string };

function listValue(items?: string[] | null) {
  return (items ?? []).join("\n");
}

function faqValue(items?: Community["faq"] | null) {
  return (items ?? []).map((item) => `${item.q} | ${item.a}`).join("\n");
}

export default function CommunityForm({
  initial,
  action,
  submitLabel,
}: {
  initial?: Community | null;
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
          <input id="slug" name="slug" required pattern="[a-z0-9-]+" defaultValue={initial?.slug ?? ""} />
        </div>
        <div className="form-field">
          <label htmlFor="status">status</label>
          <select id="status" name="status" defaultValue={initial?.status ?? "published"}>
            <option value="published">published</option>
            <option value="draft">draft</option>
            <option value="archived">archived</option>
          </select>
        </div>

        <div className="form-field full">
          <label htmlFor="name">name</label>
          <input id="name" name="name" required defaultValue={initial?.name ?? ""} />
        </div>
        <div className="form-field full">
          <label htmlFor="subtitle">subtitle</label>
          <input id="subtitle" name="subtitle" required defaultValue={initial?.subtitle ?? ""} />
        </div>

        <div className="form-field">
          <label htmlFor="currency">currency</label>
          <input id="currency" name="currency" required defaultValue={initial?.currency ?? "¥"} />
        </div>
        <div className="form-field">
          <label htmlFor="price">price</label>
          <input id="price" name="price" required defaultValue={initial?.price ?? ""} placeholder="789" />
        </div>

        <div className="form-field full">
          <label htmlFor="cover">cover image url</label>
          <input id="cover" name="cover" defaultValue={initial?.cover ?? ""} placeholder="https://…" />
        </div>
        <div className="form-field full">
          <label htmlFor="description">description</label>
          <textarea id="description" name="description" required rows={4} defaultValue={initial?.description ?? ""} />
        </div>
        <div className="form-field full">
          <label htmlFor="audience">audience</label>
          <textarea id="audience" name="audience" required rows={3} defaultValue={initial?.audience ?? ""} />
        </div>

        <div className="form-field full">
          <label htmlFor="highlights">highlights</label>
          <textarea id="highlights" name="highlights" rows={4} defaultValue={listValue(initial?.highlights)} />
          <span className="hint">One item per line.</span>
        </div>
        <div className="form-field full">
          <label htmlFor="includes">includes</label>
          <textarea id="includes" name="includes" rows={4} defaultValue={listValue(initial?.includes)} />
          <span className="hint">One item per line.</span>
        </div>
        <div className="form-field full">
          <label htmlFor="faq">FAQ</label>
          <textarea id="faq" name="faq" rows={4} defaultValue={faqValue(initial?.faq)} />
          <span className="hint">One item per line: Question | Answer</span>
        </div>
        <div className="form-field full">
          <label htmlFor="join_instructions">join instructions</label>
          <textarea
            id="join_instructions"
            name="join_instructions"
            required
            rows={4}
            defaultValue={initial?.join_instructions ?? ""}
          />
        </div>

        <div className="form-field">
          <label htmlFor="cta_label">CTA label</label>
          <input id="cta_label" name="cta_label" required defaultValue={initial?.cta_label ?? "查看加入方式"} />
        </div>
        <div className="form-field">
          <label htmlFor="sort_order">sort order</label>
          <input id="sort_order" name="sort_order" type="number" defaultValue={initial?.sort_order ?? 100} />
        </div>
        <label className="check-field full">
          <input type="checkbox" name="featured" defaultChecked={!!initial?.featured} />
          <span>Featured community</span>
        </label>
      </div>

      <div className="form-actions">
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "saving…" : submitLabel}
        </button>
        <Link href="/admin/communities" className="btn ghost">
          cancel
        </Link>
      </div>
    </form>
  );
}
