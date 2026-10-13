import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";

export const instant = false;

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="dashboard-shell">
      <section className="dashboard-card">
        <p className="eyebrow">Authenticated session</p>
        <h1>Your dashboard</h1>
        <p className="muted">
          Signed in as <strong>{user.email}</strong>
        </p>
        <p className="dashboard-copy">
          Logging out removes this session from the server before clearing the
          browser cookie.
        </p>
        <Link href="/logout" className="button-link secondary-button">
          Sign out
        </Link>
      </section>
    </main>
  );
}