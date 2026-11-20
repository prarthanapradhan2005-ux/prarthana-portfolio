-- Run this in Supabase SQL Editor.
-- Public visitors can read the single portfolio record and public files.
-- Only the authenticated owner email can change portfolio content or upload/delete files.

create table if not exists public.portfolio_content (
  id integer primary key check (id = 1),
  content jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.portfolio_content enable row level security;

drop policy if exists "Public can read portfolio" on public.portfolio_content;
create policy "Public can read portfolio" on public.portfolio_content for select to anon, authenticated using (true);
drop policy if exists "Owner can insert portfolio" on public.portfolio_content;
create policy "Owner can insert portfolio" on public.portfolio_content for insert to authenticated with check (lower(coalesce(auth.jwt()->>'email',''))='prarthanapradhan2005@gmail.com' and auth.uid() is not null);
drop policy if exists "Owner can update portfolio" on public.portfolio_content;
create policy "Owner can update portfolio" on public.portfolio_content for update to authenticated using (lower(coalesce(auth.jwt()->>'email',''))='prarthanapradhan2005@gmail.com') with check (lower(coalesce(auth.jwt()->>'email',''))='prarthanapradhan2005@gmail.com');
drop policy if exists "Owner can delete portfolio" on public.portfolio_content;
create policy "Owner can delete portfolio" on public.portfolio_content for delete to authenticated using (lower(coalesce(auth.jwt()->>'email',''))='prarthanapradhan2005@gmail.com');

-- Public bucket: portfolio PDFs/images are meant to be publicly viewable.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-public','portfolio-public',true,15728640,array['application/pdf','image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true, file_size_limit=15728640, allowed_mime_types=array['application/pdf','image/jpeg','image/png','image/webp'];

drop policy if exists "Anyone can view portfolio files" on storage.objects;
create policy "Anyone can view portfolio files" on storage.objects for select to anon, authenticated using (bucket_id='portfolio-public');
drop policy if exists "Owner can upload portfolio files" on storage.objects;
create policy "Owner can upload portfolio files" on storage.objects for insert to authenticated with check (bucket_id='portfolio-public' and lower(coalesce(auth.jwt()->>'email',''))='prarthanapradhan2005@gmail.com');
drop policy if exists "Owner can update portfolio files" on storage.objects;
create policy "Owner can update portfolio files" on storage.objects for update to authenticated using (bucket_id='portfolio-public' and lower(coalesce(auth.jwt()->>'email',''))='prarthanapradhan2005@gmail.com') with check (bucket_id='portfolio-public' and lower(coalesce(auth.jwt()->>'email',''))='prarthanapradhan2005@gmail.com');
drop policy if exists "Owner can delete portfolio files" on storage.objects;
create policy "Owner can delete portfolio files" on storage.objects for delete to authenticated using (bucket_id='portfolio-public' and lower(coalesce(auth.jwt()->>'email',''))='prarthanapradhan2005@gmail.com');

-- In Supabase Auth settings: disable public sign-ups.
-- Create only the owner account manually: prarthanapradhan2005@gmail.com.
