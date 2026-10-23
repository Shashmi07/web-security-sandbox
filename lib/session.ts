import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const SESSION_COOKIE = "sandbox_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type SessionUser = {
  id: string;
  email: string;
  role: string;
};

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(
    Date.now() + SESSION_TTL_SECONDS * 1000
  ).toISOString();

  const { error } = await supabase.from("app_sessions").insert({
    token_hash: hashSessionToken(token),
    user_id: userId,
    expires_at: expiresAt,
  });

  if (error) {
    console.error("Session creation database error:", error.code);
    throw new Error("Unable to create a session.");
  }

  return { token, expiresAt };
}

export async function destroySession(token: string | undefined) {
  if (!token) {
    return;
  }

  const { error } = await supabase
    .from("app_sessions")
    .delete()
    .eq("token_hash", hashSessionToken(token));

  if (error) {
    console.error("Session deletion database error:", error.code);
    throw new Error("Unable to destroy the session.");
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const { data: session, error: sessionError } = await supabase
    .from("app_sessions")
    .select("user_id, expires_at")
    .eq("token_hash", hashSessionToken(token))
    .gt("expires_at", new Date().toISOString())
    .is("revoked_at", null)
    .maybeSingle();

  if (sessionError) {
    console.error("Session lookup database error:", sessionError.code);
    return null;
  }

  if (!session) {
    return null;
  }

  const { data: user, error: userError } = await supabase
    .from("app_users")
    .select("id, email, role")
    .eq("id", session.user_id)
    .maybeSingle();

  if (userError) {
    console.error("User lookup database error:", userError.code);
    return null;
  }

  return user;
}

export function setSessionCookie(
  response: NextResponse,
  token: string,
  expiresAt: string
) {
  response.cookies.set(SESSION_COOKIE, token, {
    expires: new Date(expiresAt),
    httpOnly: true,
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}