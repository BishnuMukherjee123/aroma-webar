-- Run this entire script in your Supabase Dashboard -> SQL Editor

-- 1. Create the bucket and ensure it is PUBLIC
INSERT INTO storage.buckets (id, name, public) 
VALUES ('aroma-assets', 'aroma-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing policies to prevent conflicts (optional, but safe)
DROP POLICY IF EXISTS "Public View Access" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete Access" ON storage.objects;

-- 3. Create Policy: Allow absolutely ANYONE to view/read the files (Needed for <img> tags)
CREATE POLICY "Public View Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'aroma-assets' );

-- 4. Create Policy: Allow authenticated users to upload new files
CREATE POLICY "Auth Upload Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'aroma-assets' );

-- 5. Create Policy: Allow authenticated users to update their files
CREATE POLICY "Auth Update Access"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'aroma-assets' );

-- 6. Create Policy: Allow authenticated users to delete files
CREATE POLICY "Auth Delete Access"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'aroma-assets' );
