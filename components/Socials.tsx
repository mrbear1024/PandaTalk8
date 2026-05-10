import { getSiteSettings } from "@/lib/site-settings";

export default async function Socials() {
  const { site } = await getSiteSettings();
  return (
    <div className="socials">
      {site.socials.map((s) => (
        <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
          <strong>{s.label}</strong> <span style={{ opacity: 0.6 }}>·</span> {s.handle}
        </a>
      ))}
    </div>
  );
}
