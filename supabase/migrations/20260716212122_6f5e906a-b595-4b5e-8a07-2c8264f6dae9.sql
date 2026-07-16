
-- Public read on gallery bucket
CREATE POLICY "Public read gallery bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

-- Anyone can upload to the "submissions/" prefix
CREATE POLICY "Public upload to submissions"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery' AND (storage.foldername(name))[1] = 'submissions');

-- Admins can upload / update / delete anywhere in the gallery bucket
CREATE POLICY "Admins can manage gallery objects insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update gallery objects"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gallery objects"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));
