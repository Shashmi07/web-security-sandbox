import Link from "next/link";

export default function Home() {
  return (
    <main className="landing-shell">
      <section className="landing-card">
        <p className="eyebrow">Web security sandbox</p>
        <h1>Practice secure authentication.</h1>
        <p className="muted">
          Server-side sessions, uniform login errors, and modern password
          hashing in one small exercise.
        </p>
        <div className="landing-actions">
          <Link href="/login" className="button-link">
            Sign in
          </Link>
          <Link href="/register" className="button-link secondary-button">
            Create account
          </Link>
          <Link href="/logout" className="button-link secondary-button">
            Log out
          </Link>
        </div>
      </section>
    </main>
  );
}
