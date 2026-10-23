type Attempt = {
  count: number;
  expiresAt: number;
};

const attempts = new Map<string, Attempt>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function checkLoginRateLimit(email: string, ip: string) {
  const now = Date.now();
  const keys = [`email:${email}`, `ip:${ip}`];
  const currentAttempts = keys
    .map((key) => attempts.get(key))
    .filter((attempt): attempt is Attempt => Boolean(attempt && attempt.expiresAt > now));

  for (const key of keys) {
    const current = attempts.get(key);
    if (!current || current.expiresAt <= now) {
      attempts.set(key, { count: 0, expiresAt: now + WINDOW_MS });
    }
  }

  const limitedAttempt = currentAttempts.find(
    (attempt) => attempt.count >= MAX_ATTEMPTS
  );

  return {
    allowed: !limitedAttempt,
    retryAfterSeconds: limitedAttempt
      ? Math.ceil((limitedAttempt.expiresAt - now) / 1000)
      : 0,
  };
}

export function recordLoginFailure(email: string, ip: string) {
  const now = Date.now();
  for (const key of [`email:${email}`, `ip:${ip}`]) {
    const current = attempts.get(key);
    if (!current || current.expiresAt <= now) {
      attempts.set(key, { count: 1, expiresAt: now + WINDOW_MS });
    } else {
      current.count += 1;
    }
  }
}

export function clearLoginFailures(email: string, ip: string) {
  attempts.delete(`email:${email}`);
  attempts.delete(`ip:${ip}`);
}
