"use client";

import { useTransition } from "react";

export default function DeleteForm({
  action,
  label = "delete",
  confirm,
}: {
  action: () => Promise<void>;
  label?: string;
  confirm: string;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className="link-action danger"
      style={{ background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit" }}
      disabled={pending}
      onClick={() => {
        if (!window.confirm(confirm)) return;
        start(async () => {
          await action();
        });
      }}
    >
      {pending ? "…" : label}
    </button>
  );
}
