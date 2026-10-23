This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Supabase lead-access test data

The schema and test records are SQL files. Do not run `supabase-schema.sql`
directly as a PowerShell command.

1. Open the Supabase dashboard for your project and open **SQL Editor**.
2. Copy and run the contents of `supabase-schema.sql`.
3. Copy and run the contents of `supabase-seed.sql`.
4. Start the application and open `http://localhost:3000/lead-access-test`.

The seed creates `admin@example.com`, `user-a@example.com`, and
`user-b@example.com` with the test passwords documented at the top of
`supabase-seed.sql`.

If the Supabase CLI is installed and linked to the project, run the files from
PowerShell with:

```powershell
supabase db query --file .\supabase-schema.sql
supabase db query --file .\supabase-seed.sql
```

Alternatively, with PostgreSQL `psql` and a database connection string:

```powershell
psql "$env:DATABASE_URL" -f .\supabase-schema.sql
psql "$env:DATABASE_URL" -f .\supabase-seed.sql
```

Apply `policies.sql` after the schema and seed to enable lead row-level
security. The policies restrict each authenticated Supabase user to rows where
`auth.uid()` matches `owner_id`; anonymous table access is revoked.

## Security checks

- Session cookies are `HttpOnly`, `SameSite=Lax`, have a seven-day max age,
  and are `Secure` in production. Logout deletes the server-side session
  before expiring the cookie.
- Login returns the same invalid-credentials message for unknown emails and
  incorrect passwords, and limits failed attempts to five per email and IP
  within 15 minutes.
- Lead input is validated with Zod. Invalid input returns a safe `400`
  response, while unexpected route errors are logged server-side and return a
  generic `500` response.
- Content Security Policy and baseline security headers are configured in
  `next.config.ts`. Inspect the response headers in browser DevTools under
  **Network** after starting the app.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
