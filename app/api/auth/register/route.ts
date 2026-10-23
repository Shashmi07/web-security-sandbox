
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { hashPassword } from "@/lib/password";
import { serverError } from "@/lib/api-handler";


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
        { message: "Please provide a valid email and password." },
        { status: 400 }
      );
    }

    const email = body.email.trim().toLowerCase();
    const password = body.password;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email) || email.length > 254) {
      return NextResponse.json(
        { message: "Please provide a valid email and password." },
        { status: 400 }
      );
    }

    if (
      password.length < 12 ||
      Buffer.byteLength(password, "utf8") > 1024
    ) {
      return NextResponse.json(
        { message: "Password must be at least 12 characters long." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password, "argon2id");

    const { error } = await supabase
      .from("app_users")
      .insert({
        email,
        password_hash: passwordHash,
      });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "Unable to register with these details." },
          { status: 400 }
        );
      }

      console.error("Registration database error:", error.code);

      return NextResponse.json(
        { message: "Registration failed. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Registration successful." },
      { status: 201 }
    );
  } catch (error) {
    return serverError(error, "Registration request error");
  }
}
