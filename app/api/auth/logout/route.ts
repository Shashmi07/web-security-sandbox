import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySession, SESSION_COOKIE } from "@/lib/session";

export async function POST() {
  try {
    const cookieStore = await cookies();
    await destroySession(cookieStore.get(SESSION_COOKIE)?.value);

    const response = NextResponse.json({ message: "Logged out." });
    response.cookies.set(SESSION_COOKIE, "", {
      expires: new Date(0),
      httpOnly: true,
      maxAge: 0,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch (error) {
    console.error("Logout request error:", error);
    return NextResponse.json(
      { message: "Logout failed. Please try again." },
      { status: 500 }
    );
  }
}
