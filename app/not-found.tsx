import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container" style={{ padding: "var(--sp-9) 0" }}>
      <h1>404</h1>
      <Link href="/">← home</Link>
    </div>
  );
}
