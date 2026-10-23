import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyPassword } from "@/lib/password";
import {
  createSession,
  setSessionCookie,
} from "@/lib/session";
import {
  checkLoginRateLimit,
  clearLoginFailures,
  recordLoginFailure,
} from "@/lib/rate-limit";
import { serverError } from "@/lib/api-handler";

const INVALID_LOGIN_HASH =
  "$argon2id$v=19$m=19456,p=1,t=2$420HOlmakgHpt5zGyROf0w$b9PGqJTXNHGUclrf8HJMLVNphItMaF5tj8chNnjjBzo";
const INVALID_LOGIN_MESSAGE = "Invalid email or password.";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("email" in body) ||
      !("password" in body) ||
      typeof body.email !== "string" ||
      typeof body.password !== "string"
    ) {
      return NextResponse.json(
        { message: INVALID_LOGIN_MESSAGE },
        { status: 401 }
      );
    }

    const email = body.email.trim().toLowerCase();
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim()
      || request.headers.get("x-real-ip")
      || "unknown";
    const rateLimit = checkLoginRateLimit(email, ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { message: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    const { data: user, error } = await supabase
      .from("app_users")
      .select("id, email, password_hash")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Login database error:", error.code);
      return NextResponse.json(
        { message: "Login failed. Please try again." },
        { status: 500 }
      );
    }

    const passwordMatches = await verifyPassword(
      body.password,
      user?.password_hash ?? INVALID_LOGIN_HASH
    );

    if (!user || !passwordMatches) {
      recordLoginFailure(email, ip);
      return NextResponse.json(
        { message: INVALID_LOGIN_MESSAGE },
        { status: 401 }
      );
    }

    clearLoginFailures(email, ip);
    const { token, expiresAt } = await createSession(user.id);
    const response = NextResponse.json(
      { message: "Login successful." },
      { status: 200 }
    );
    setSessionCookie(response, token, expiresAt);
    return response;
  } catch (error) {
    return serverError(error, "Login request error");
  }
}
