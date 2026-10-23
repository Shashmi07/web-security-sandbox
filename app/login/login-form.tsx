"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm({
  showRegisteredMessage,
  showLoggedOutMessage,
}: {
  showRegisteredMessage: boolean;
  showLoggedOutMessage: boolean;
}) {
  const router = useRouter();
  const [message, setMessage] = useState(
    showRegisteredMessage
      ? "Registration successful. You can now sign in."
      : showLoggedOutMessage
        ? "You have been logged out."
        : ""
  );
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    const result = await response.json();
    setPending(false);

    if (!response.ok) {
      setMessage(result.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
        {message && (
          <p
            className={`form-message ${
              message.startsWith("Registration") || message.startsWith("You have")
                ? "success"
                : "error"
            }`}
          >
            {message}
          </p>
        )}
        <button type="submit" disabled={pending}>
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="auth-footer">
        Need an account? <Link href="/register">Register</Link>
      </p>
    </>
  );
}
