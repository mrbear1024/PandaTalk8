"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  file: File | null;
  aspectRatio?: number;
  onApply: (blob: Blob) => void;
  onClose: () => void;
};

export default function CoverCropDialog({
  open,
  file,
  aspectRatio = 5 / 2,
  onApply,
  onClose,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [applying, setApplying] = useState(false);

  const [natW, setNatW] = useState(0);
  const [natH, setNatH] = useState(0);
  const [vpW, setVpW] = useState(0);
  const [vpH, setVpH] = useState(0);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });

  // ── Blob URL lifecycle ─────────────────────────────────────────────────
  useEffect(() => {
    if (!open || !file) {
      setBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }
    const url = URL.createObjectURL(file);
    setBlobUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [open, file]);

  // ── Reset on open ──────────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setImgLoaded(false);
      setApplying(false);
      setNatW(0);
      setNatH(0);
    }
  }, [open]);

  // ── Compute viewport size (largest rect with aspectRatio inside wrapper) ─
  useEffect(() => {
    if (!open) return;
    const el = wrapperRef.current;
    if (!el) return;
    const measure = () => {
      const pad = 40;
      const aw = el.clientWidth - pad * 2;
      const ah = el.clientHeight - pad * 2;
      if (aw <= 0 || ah <= 0) return;
      let w: number, h: number;
      if (aw / ah > aspectRatio) {
        h = ah;
        w = h * aspectRatio;
      } else {
        w = aw;
        h = w / aspectRatio;
      }
      setVpW(Math.round(w));
      setVpH(Math.round(h));
    };
    measure();
    const obs = new ResizeObserver(measure);
    obs.observe(el);
    return () => obs.disconnect();
  }, [open, aspectRatio]);

  const coverScale =
    natW > 0 && natH > 0 && vpW > 0 ? Math.max(vpW / natW, vpH / natH) : 1;
  const scale = coverScale * zoom;
  const imgW = natW * scale;
  const imgH = natH * scale;
  const imgLeft = (vpW - imgW) / 2 + pan.x;
  const imgTop = (vpH - imgH) / 2 + pan.y;
  const ready = imgLoaded && vpW > 0 && natW > 0;

  const clampPan = useCallback(
    (px: number, py: number) => {
      const maxX = Math.max(0, (imgW - vpW) / 2);
      const maxY = Math.max(0, (imgH - vpH) / 2);
      return {
        x: Math.max(-maxX, Math.min(maxX, px)),
        y: Math.max(-maxY, Math.min(maxY, py)),
      };
    },
    [imgW, imgH, vpW, vpH]
  );

  useEffect(() => {
    setPan((p) => clampPan(p.x, p.y));
  }, [clampPan]);

  const handleImgLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    setNatW(e.currentTarget.naturalWidth);
    setNatH(e.currentTarget.naturalHeight);
    setImgLoaded(true);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!ready) return;
      e.preventDefault();
      viewportRef.current?.setPointerCapture(e.pointerId);
      setDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
    },
    [ready, pan]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPan(clampPan(dragStart.current.px + dx, dragStart.current.py + dy));
    },
    [dragging, clampPan]
  );

  const handlePointerUp = useCallback(() => setDragging(false), []);

  const handleApply = useCallback(async () => {
    if (!ready || !blobUrl) return;
    setApplying(true);
    try {
      const srcX = -imgLeft / scale;
      const srcY = -imgTop / scale;
      const srcW = vpW / scale;
      const srcH = vpH / scale;

      const outW = Math.min(Math.round(srcW), 1920);
      const outH = Math.round(outW / aspectRatio);

      const img = new Image();
      img.src = blobUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Image load failed"));
      });

      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, outW, outH);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
          "image/jpeg",
          0.92
        );
      });
      onApply(blob);
    } catch (err) {
      console.error("[CoverCrop]", err);
    } finally {
      setApplying(false);
    }
  }, [ready, blobUrl, imgLeft, imgTop, scale, vpW, vpH, aspectRatio, onApply]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="crop-dialog">
      <div className="crop-header">
        <button type="button" className="crop-back" onClick={onClose} aria-label="cancel">
          ←
        </button>
        <h2 className="crop-title">crop cover</h2>
        <button
          type="button"
          className="btn"
          onClick={handleApply}
          disabled={applying || !ready}
        >
          {applying ? "applying…" : "apply"}
        </button>
      </div>

      <div ref={wrapperRef} className="crop-stage">
        {ready ? (
          <div
            ref={viewportRef}
            className={`crop-viewport ${dragging ? "is-dragging" : ""}`}
            style={{ width: vpW, height: vpH }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={blobUrl ?? ""}
              alt=""
              draggable={false}
              className="crop-img"
              style={{ width: imgW, height: imgH, left: imgLeft, top: imgTop }}
            />
          </div>
        ) : (
          <div className="crop-loading">loading image…</div>
        )}

        {!imgLoaded && blobUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={blobUrl}
            alt=""
            onLoad={handleImgLoad}
            style={{ position: "absolute", visibility: "hidden", width: 0, height: 0 }}
          />
        ) : null}
      </div>

      <div className="crop-controls">
        <button
          type="button"
          className="zoom-btn"
          onClick={() => setZoom((z) => Math.max(1, +(z - 0.1).toFixed(2)))}
          disabled={zoom <= 1}
          aria-label="zoom out"
        >
          −
        </button>
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="zoom-range"
          aria-label="zoom"
        />
        <button
          type="button"
          className="zoom-btn"
          onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))}
          disabled={zoom >= 3}
          aria-label="zoom in"
        >
          +
        </button>
      </div>
    </div>
  );
}
