import { NextResponse, type NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "node:crypto";
import { checkApiAuth } from "@/lib/api-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Image upload endpoint for the pt-blog CLI / skill. Uses bearer-token auth
// (BLOG_API_KEY) — separate from the cookie-authed /api/upload/cover used by
// the admin browser UI. Both write to the same R2 bucket under pandatalk/.

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);
const MAX_BYTES = 25 * 1024 * 1024;
const PREFIX = "pandatalk";

function extFor(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  if (mime === "image/avif") return "avif";
  return "jpg";
}

let cachedClient: S3Client | null = null;
function getR2(): S3Client {
  if (cachedClient) return cachedClient;
  const account = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  if (!account || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 credentials missing on the server.");
  }
  cachedClient = new S3Client({
    region: "auto",
    endpoint: `https://${account}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  return cachedClient;
}

export async function POST(req: NextRequest) {
  const fail = checkApiAuth(req);
  if (fail) return fail;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Bad multipart body." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing 'file' field." }, { status: 400 });
  }
  const mime = file.type || "image/jpeg";
  if (!ALLOWED.has(mime)) {
    return NextResponse.json({ error: `Unsupported type: ${mime}` }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 25 MB)." }, { status: 400 });
  }

  const bucket = process.env.CLOUDFLARE_R2_BUCKET;
  const publicBase = process.env.CLOUDFLARE_R2_PUBLIC_URL;
  if (!bucket || !publicBase) {
    return NextResponse.json(
      { error: "R2 not configured on the server." },
      { status: 500 }
    );
  }

  const ext = extFor(mime);
  const key = `${PREFIX}/${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
  const body = Buffer.from(await file.arrayBuffer());

  const startedAt = Date.now();
  try {
    await getR2().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: mime,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
    console.info(
      `[api/v1/upload] ok in ${Date.now() - startedAt}ms — bucket=${bucket} key=${key} size=${body.length}B mime=${mime}`
    );
  } catch (err) {
    const e = err as { name?: string; $metadata?: { httpStatusCode?: number }; message?: string };
    console.error(
      `[api/v1/upload] R2 put FAILED after ${Date.now() - startedAt}ms — ` +
        `name=${e?.name ?? "?"} ` +
        `status=${e?.$metadata?.httpStatusCode ?? "?"} ` +
        `bucket=${bucket} key=${key} size=${body.length}B\n` +
        `  ${e?.message ?? String(err)}`
    );
    return NextResponse.json({ error: "R2 upload failed." }, { status: 500 });
  }

  const url = `${publicBase.replace(/\/$/, "")}/${key}`;
  return NextResponse.json({ url, key });
}
