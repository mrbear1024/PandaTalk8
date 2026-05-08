import type { ReactNode } from "react";

export default function ASCIIDivider({ children }: { children?: ReactNode }) {
  return <div className="ascii-divider">{children ?? "· · · panda · · ·"}</div>;
}
