"use client";

import { useTransition } from "react";

export default function PinForm({
  action,
  pinned,
}: {
  action: () => Promise<void>;
  pinned: boolean;
}) {
  const [pending, start] = useTransition();
  const label = pinned ? "unpin" : "pin";
  return (
    <button
      type="button"
      className="link-action"
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        font: "inherit",
        color: pinned ? "var(--panda-red-deep)" : undefined,
      }}
      disabled={pending}
      onClick={() => {
        start(async () => {
          await action();
        });
      }}
      title={pinned ? "Unpin from top" : "Pin to top of blog"}
    >
      {pending ? "…" : label}
    </button>
  );
}
