
-- Create the blog-images storage bucket if it doesn't exist
insert into storage.buckets (id, name, public)
select 'blog-images', 'blog-images', true
where not exists (
    select 1 from storage.buckets where id = 'blog-images'
);

-- Set up storage policy to allow authenticated uploads
create policy "Allow authenticated uploads"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'blog-images'
);

-- Set up storage policy to allow public downloads
create policy "Allow public downloads"
on storage.objects for select
to public
using (
    bucket_id = 'blog-images'
);
