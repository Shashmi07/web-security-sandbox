-- Test accounts for the lead-access dashboard.
-- Passwords:
--   admin@example.com   Admin-Test-2026!
--   user-a@example.com  UserA-Test-2026!
--   user-b@example.com  UserB-Test-2026!
--
-- Run supabase-schema.sql before this file.

insert into public.app_users (id, email, password_hash, role)
values
  (
    '00000000-0000-0000-0000-000000000001',
    'admin@example.com',
    '$argon2id$v=19$m=19456,p=1,t=2$7zVtJnJOiNsyyTCpnrjiIg$jSgbRGN+ghMxuTv4om/s8t53jJUL2x+L+84mG5ZvnCw',
    'admin'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'user-a@example.com',
    '$argon2id$v=19$m=19456,p=1,t=2$nhr/hudRcb34/kLozti2ZA$ooveD247P9H9p/dPRHK5nQWJgvWIfQ3YrG7xiUFL5Hw',
    'user'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'user-b@example.com',
    '$argon2id$v=19$m=19456,p=1,t=2$V37W9i1/V2hKJlbPf6qnEw$1v02NEAt6MSn99cG51+ZDZ8ba9epmRqTxKgZgPZiCBs',
    'user'
  )
on conflict (id) do update
set email = excluded.email,
    password_hash = excluded.password_hash,
    role = excluded.role;

insert into public.leads (id, name, email, phone, status, owner_id)
values
  (
    '10000000-0000-0000-0000-000000000001',
    'User A test lead',
    'lead-a@example.com',
    '+15550100001',
    'new',
    '00000000-0000-0000-0000-000000000002'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'User B test lead',
    'lead-b@example.com',
    '+15550100002',
    'new',
    '00000000-0000-0000-0000-000000000003'
  )
on conflict (id) do update
set name = excluded.name,
    email = excluded.email,
    phone = excluded.phone,
    status = excluded.status,
    owner_id = excluded.owner_id;
