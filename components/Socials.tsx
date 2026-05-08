import { SITE } from "@/lib/site";

export default function Socials() {
  return (
    <div className="socials">
      {SITE.socials.map((s) => (
        <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
          <strong>{s.label}</strong> <span style={{ opacity: 0.6 }}>·</span> {s.handle}
        </a>
      ))}
    </div>
  );
}
