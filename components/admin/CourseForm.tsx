"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { Course } from "@/lib/types";

type ActionResult = { error?: string };

export default function CourseForm({
  initial,
  action,
  submitLabel,
}: {
  initial?: Course | null;
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
          <select id="status" name="status" defaultValue={initial?.status ?? "coming_soon"}>
            <option value="coming_soon">coming soon</option>
            <option value="available">available</option>
            <option value="archived">archived</option>
          </select>
        </div>

        <div className="form-field full">
          <label htmlFor="title">title</label>
          <input id="title" name="title" required defaultValue={initial?.title ?? ""} />
        </div>
        <div className="form-field full">
          <label htmlFor="subtitle">subtitle</label>
          <input id="subtitle" name="subtitle" required defaultValue={initial?.subtitle ?? ""} />
        </div>
        <div className="form-field full">
          <label htmlFor="cover">cover image url</label>
          <input id="cover" name="cover" defaultValue={initial?.cover ?? ""} placeholder="https://…" />
        </div>
        <div className="form-field full">
          <label htmlFor="description">description</label>
          <textarea id="description" name="description" required rows={5} defaultValue={initial?.description ?? ""} />
        </div>

        <div className="form-field">
          <label htmlFor="price">price/status text</label>
          <input id="price" name="price" required defaultValue={initial?.price ?? ""} placeholder="Coming soon / ¥499" />
        </div>
        <div className="form-field">
          <label htmlFor="sort_order">sort order</label>
          <input id="sort_order" name="sort_order" type="number" defaultValue={initial?.sort_order ?? 100} />
        </div>
        <div className="form-field">
          <label htmlFor="external_url">external course url</label>
          <input id="external_url" name="external_url" defaultValue={initial?.external_url ?? "#"} placeholder="https://…" />
        </div>
        <div className="form-field">
          <label htmlFor="cta_label">CTA label</label>
          <input id="cta_label" name="cta_label" required defaultValue={initial?.cta_label ?? "查看课程系统"} />
        </div>
        <label className="check-field full">
          <input type="checkbox" name="featured" defaultChecked={!!initial?.featured} />
          <span>Featured course</span>
        </label>
      </div>

      <div className="form-actions">
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "saving…" : submitLabel}
        </button>
        <Link href="/admin/courses" className="btn ghost">
          cancel
        </Link>
      </div>
    </form>
  );
}
