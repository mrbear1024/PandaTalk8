"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, ADMIN_TTL_MS, makeSessionToken } from "@/lib/auth";

export async function loginAction(formData: FormData): Promise<{ error?: string }> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return { error: "ADMIN_PASSWORD is not set on the server." };
  }
  const submitted = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  if (submitted !== password) {
    return { error: "Wrong password." };
  }
  const expiresAt = Date.now() + ADMIN_TTL_MS;
  const token = await makeSessionToken(password, expiresAt);
  cookies().set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(ADMIN_TTL_MS / 1000),
  });
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction(): Promise<void> {
  cookies().delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
