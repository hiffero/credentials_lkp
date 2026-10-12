-- Jalankan di Supabase Dashboard > SQL Editor.
create table if not exists public.credentials (
  id uuid primary key,
  name varchar(200) not null,
  program varchar(200) not null,
  grade varchar(30) not null,
  class_name varchar(200) not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_credentials_class on public.credentials (class_name);
create index if not exists idx_credentials_created on public.credentials (created_at desc);

-- Semua akses tabel dilakukan melalui API server dengan secret key.
-- RLS aktif dan tidak ada policy publik; jangan membuat policy SELECT untuk anon.
alter table public.credentials enable row level security;
