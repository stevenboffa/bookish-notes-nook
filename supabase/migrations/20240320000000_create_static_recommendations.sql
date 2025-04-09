-- Create the static_book_recommendations table
create table if not exists public.static_book_recommendations (
  id uuid default uuid_generate_v4() primary key,
  category text not null,
  section text not null,
  books jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(category, section)
);

-- Add RLS policies
alter table public.static_book_recommendations enable row level security;

-- Allow anyone to read recommendations
create policy "Anyone can read recommendations"
  on public.static_book_recommendations
  for select
  to public
  using (true);

-- Only allow service role to insert/update/delete
create policy "Service role can manage recommendations"
  on public.static_book_recommendations
  for all
  to service_role
  using (true)
  with check (true);

-- Create index for faster lookups
create index if not exists idx_static_book_recommendations_category_section
  on public.static_book_recommendations(category, section); 