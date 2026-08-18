CREATE TABLE IF NOT EXISTS public.authority_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'Others',
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL
);

ALTER TABLE public.authority_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view authority updates" ON public.authority_updates
  FOR SELECT USING (true);

CREATE POLICY "Authorities can insert updates" ON public.authority_updates
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('municipality_admin', 'institute_admin')
    )
  );

CREATE POLICY "Authorities can update their own updates" ON public.authority_updates
  FOR UPDATE TO authenticated
  USING (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('municipality_admin', 'institute_admin')
    )
  );

CREATE POLICY "Authorities can delete their own updates" ON public.authority_updates
  FOR DELETE TO authenticated
  USING (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('municipality_admin', 'institute_admin')
    )
  );

GRANT ALL ON public.authority_updates TO anon;
GRANT ALL ON public.authority_updates TO authenticated;
GRANT ALL ON public.authority_updates TO service_role;
