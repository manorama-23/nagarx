-- Create storage buckets for grievances and resolution proofs
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('grievance-images', 'grievance-images', true),
  ('resolution-proofs', 'resolution-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read grievance images
CREATE POLICY "Anyone can view grievance images" ON storage.objects
  FOR SELECT USING (bucket_id = 'grievance-images');

-- Allow authenticated users to upload grievance images
CREATE POLICY "Authenticated users can upload grievance images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'grievance-images'
  );

-- Allow public access to view resolution proofs
CREATE POLICY "Anyone can view resolution proofs" ON storage.objects
  FOR SELECT USING (bucket_id = 'resolution-proofs');

-- Allow authorities (municipality/institute admins) to upload resolution proofs
CREATE POLICY "Authorities can upload resolution proofs" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'resolution-proofs' AND (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('municipality_admin', 'institute_admin')
      )
    )
  );
