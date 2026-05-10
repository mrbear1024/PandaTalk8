import { existsSync, readFileSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

function readEnvFile(path: string) {
  if (!existsSync(path)) return;
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    const value = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

readEnvFile(".env.local");

const url = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;

if (!url) {
  throw new Error("Set SUPABASE_DB_URL or DATABASE_URL to run Drizzle migrations.");
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
});
