-- Run this in the Supabase SQL editor after creating app_users.
-- app_users must contain: id (uuid primary key), email (unique), password_hash.

create table if not exists public.app_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists app_sessions_token_hash_idx
  on public.app_sessions (token_hash);

create index if not exists app_sessions_expires_at_idx
  on public.app_sessions (expires_at);
