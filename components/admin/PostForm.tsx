"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { blocksToHtml } from "@/lib/body-parser";
import type { Post } from "@/lib/types";
import CoverCropDialog from "./CoverCropDialog";
import RichEditor from "./RichEditor";

type ActionResult = { error?: string };

export default function PostForm({
  initial,
  action,
  submitLabel,
}: {
  initial?: Post | null;
  action: (fd: FormData) => Promise<ActionResult>;
  submitLabel: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const [coverUrl, setCoverUrl] = useState<string>(initial?.cover ?? "");
  const [uploading, setUploading] = useState(false);

  const [cropFile, setCropFile] = useState<File | null>(null);
  const [showCrop, setShowCrop] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // body is jsonb. New posts store HTML as a string; legacy posts store
  // the typed-block array. Branch on the runtime type to load either.
  const initialHtml =
    typeof initial?.body === "string"
      ? initial.body
      : blocksToHtml(initial?.body ?? null);
  const bodyHtmlRef = useRef<string>(initialHtml);
  const bodyTextRef = useRef<string>("");

  function pickFile() {
    fileInputRef.current?.click();
  }

  function onFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setCropFile(f);
    setShowCrop(true);
  }

  async function handleCropApply(blob: Blob) {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", blob, "cover.jpg");
      const res = await fetch("/api/upload/cover", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error || `Upload failed (${res.status}).`);
        return;
      }
      setCoverUrl(json.url);
      setShowCrop(false);
      setCropFile(null);
    } catch {
      setError("Network error during upload.");
    } finally {
      setUploading(false);
    }
  }

  function clearCover() {
    setCoverUrl("");
  }

  return (
    <>
      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          fd.set("cover", coverUrl);
          fd.set("body_html", bodyHtmlRef.current);
          fd.set("body_text", bodyTextRef.current);
          setError(null);
          start(async () => {
            const res = await action(fd);
            if (res?.error) setError(res.error);
          });
        }}
      >
        {error ? <div className="alert">{error}</div> : null}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden-file"
          onChange={onFileChosen}
        />
        <input type="hidden" name="cover" value={coverUrl} />

        {coverUrl ? (
          <div className="cover-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverUrl} alt="" className="cover-img" />
            <div className="cover-overlay">
              <button type="button" className="overlay-btn" onClick={pickFile}>
                replace
              </button>
              <button
                type="button"
                className="overlay-btn danger"
                onClick={clearCover}
                aria-label="remove cover"
              >
                remove
              </button>
            </div>
            {uploading ? <div className="cover-uploading">uploading…</div> : null}
          </div>
        ) : (
          <button
            type="button"
            className="cover-dropzone"
            onClick={pickFile}
            aria-label="upload cover image"
          >
            <span className="dropzone-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="9" cy="9" r="1.7" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </span>
            <span className="dropzone-hint">
              {uploading ? "uploading…" : "click to upload a cover — 5:2 ratio recommended"}
            </span>
          </button>
        )}

        <div className="composer-title">
          <input
            id="title"
            name="title"
            required
            placeholder="Add a title"
            defaultValue={initial?.title ?? ""}
          />
        </div>

        <div className="composer-author">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/panda-avatar.png" alt="" className="composer-avatar" />
          <span className="composer-name">Mr Panda</span>
          <span className="composer-handle">@PandaTalk8</span>
        </div>

        <div className="composer-body">
          <RichEditor
            initialHtml={initialHtml}
            placeholder="Start writing…"
            onChange={(html, text) => {
              bodyHtmlRef.current = html;
              bodyTextRef.current = text;
            }}
          />
          <div className="hint">
            Date, slug, tag, read time, and excerpt are filled in automatically on save.
          </div>
        </div>

        <div className="form-actions">
          <button className="btn" type="submit" disabled={pending || uploading}>
            {pending ? "saving…" : submitLabel}
          </button>
          <Link href="/admin/posts" className="btn ghost">
            cancel
          </Link>
        </div>
      </form>

      <CoverCropDialog
        open={showCrop}
        file={cropFile}
        onApply={handleCropApply}
        onClose={() => {
          setShowCrop(false);
          setCropFile(null);
        }}
      />
    </>
  );
}
