import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyPassword } from "@/lib/password";
import {
  createSession,
  setSessionCookie,
} from "@/lib/session";

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
      return NextResponse.json(
        { message: INVALID_LOGIN_MESSAGE },
        { status: 401 }
      );
    }

    const { token, expiresAt } = await createSession(user.id);
    const response = NextResponse.json(
      { message: "Login successful." },
      { status: 200 }
    );
    setSessionCookie(response, token, expiresAt);
    return response;
  } catch (error) {
    console.error("Login request error:", error);
    return NextResponse.json(
      { message: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
