-- Run this in the Supabase SQL editor before supabase-seed.sql.

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'qualified', 'converted', 'lost')),
  owner_id uuid not null references public.app_users(id),
  created_at timestamptz not null default now()
);

create index if not exists leads_owner_id_idx
  on public.leads (owner_id);

create table if not exists public.app_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists app_sessions_token_hash_idx
  on public.app_sessions (token_hash);

create index if not exists app_sessions_expires_at_idx
  on public.app_sessions (expires_at);
