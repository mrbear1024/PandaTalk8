"use client";

import { useState, useTransition } from "react";
import { loginAction } from "@/app/admin/_actions/auth";

export default function LoginForm({ next }: { next: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setError(null);
        start(async () => {
          const res = await loginAction(fd);
          if (res?.error) setError(res.error);
        });
      }}
    >
      <input type="hidden" name="next" value={next} />
      <div className="form-field" style={{ marginBottom: "var(--sp-4)" }}>
        <label htmlFor="password">password</label>
        <input id="password" name="password" type="password" autoFocus required />
      </div>
      {error ? <div className="alert">{error}</div> : null}
      <button className="btn" type="submit" disabled={pending}>
        {pending ? "signing in…" : "Sign in →"}
      </button>
    </form>
  );
}
