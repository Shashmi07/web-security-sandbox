import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import LeadAccessTester from "./lead-access-tester";

export const instant = false;

export default async function LeadAccessTestPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="dashboard-shell">
      <section className="dashboard-card lead-test-card">
        <p className="eyebrow">Authorization test</p>
        <h1>Lead access dashboard</h1>
        <p className="muted">
          Signed in as <strong>{user.email}</strong> ({user.role})
        </p>
        <p className="dashboard-copy">
          User A should receive 403 for User B&apos;s lead. Admin should receive
          200 for both leads.
        </p>
        <LeadAccessTester />
        <p className="auth-footer">
          <Link href="/dashboard">Back to dashboard</Link>
        </p>
      </section>
    </main>
  );
}
