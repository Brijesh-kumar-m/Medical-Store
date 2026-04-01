-- Create the public storage bucket for image uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('uploads', 'uploads', true, 5242880, '{image/jpeg,image/png,image/webp,application/pdf}') 
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if any to prevent conflicts when re-running
DROP POLICY IF EXISTS "Public Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Public View Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access" ON storage.objects;

-- Allow ANYONE to upload files (No auth required)
CREATE POLICY "Public Upload Access" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id = 'uploads');

-- Allow ANYONE to view files
CREATE POLICY "Public View Access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'uploads');

-- Allow ANYONE to delete files (Useful if clearFile is called)
CREATE POLICY "Public Delete Access" ON storage.objects
FOR DELETE TO public
USING (bucket_id = 'uploads');
