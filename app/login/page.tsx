import LoginForm from "./login-form";

export const instant = false;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; loggedOut?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">Sandbox identity</p>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to continue to your dashboard.</p>
        <LoginForm
          showRegisteredMessage={params.registered === "1"}
          showLoggedOutMessage={params.loggedOut === "1"}
        />
      </section>
    </main>
  );
}
