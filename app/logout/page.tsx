"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message ?? "Logout failed. Please try again.");
        setPending(false);
        return;
      }

      router.push("/login?loggedOut=1");
      router.refresh();
    } catch {
      setMessage("Logout failed. Please try again.");
      setPending(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">Session controls</p>
        <h1>Log out</h1>
        <p className="muted">
          This removes your session from the server and clears the browser
          cookie.
        </p>
        {message && <p className="form-message error">{message}</p>}
        <div className="landing-actions">
          <button type="button" onClick={handleLogout} disabled={pending}>
            {pending ? "Logging out..." : "Log out"}
          </button>
          <Link href="/dashboard" className="button-link secondary-button">
            Cancel
          </Link>
        </div>
      </section>
    </main>
  );
}
