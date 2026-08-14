CREATE TABLE IF NOT EXISTS public.budget_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES public.budget_proposals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE (proposal_id, user_id)
);

GRANT SELECT ON public.budget_votes TO anon;
GRANT SELECT, INSERT, DELETE ON public.budget_votes TO authenticated;
GRANT ALL ON public.budget_votes TO service_role;

ALTER TABLE public.budget_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view budget votes" ON public.budget_votes FOR SELECT USING (true);
CREATE POLICY "Users can cast their own budget vote" ON public.budget_votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their own budget vote" ON public.budget_votes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can remove their own vote" ON public.votes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.sync_budget_votes_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.budget_proposals p
  SET votes_count = (SELECT count(*) FROM public.budget_votes v WHERE v.proposal_id = p.id)
  WHERE p.id = COALESCE(NEW.proposal_id, OLD.proposal_id);
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS budget_votes_count_trg ON public.budget_votes;
CREATE TRIGGER budget_votes_count_trg
AFTER INSERT OR DELETE ON public.budget_votes
FOR EACH ROW EXECUTE FUNCTION public.sync_budget_votes_count();

CREATE OR REPLACE FUNCTION public.sync_grievance_upvotes_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.grievances g
  SET upvotes_count = (SELECT count(*) FROM public.votes v WHERE v.grievance_id = g.id)
  WHERE g.id = COALESCE(NEW.grievance_id, OLD.grievance_id);
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS grievance_votes_count_trg ON public.votes;
CREATE TRIGGER grievance_votes_count_trg
AFTER INSERT OR DELETE ON public.votes
FOR EACH ROW EXECUTE FUNCTION public.sync_grievance_upvotes_count();

INSERT INTO public.budget_proposals (title, description, category, estimated_cost, scope)
SELECT * FROM (VALUES
  ('LED Street Lighting Retrofit', 'Replace sodium lamps along the main corridor with efficient LED fixtures to improve night-time safety.', 'Infrastructure', 240000::numeric, 'civic'::issue_scope),
  ('Ward 7 Stormwater Drain Repair', 'Desilt and repair collapsed drain sections that flood the market street each monsoon.', 'Sanitation', 480000::numeric, 'civic'::issue_scope),
  ('Campus Cycle Lanes & Racks', 'Dedicated cycle lanes between hostels and academic blocks with covered parking racks.', 'Mobility', 150000::numeric, 'institute'::issue_scope),
  ('Library Night Study Wing', 'Extend the reading wing with 24/7 access, backup power and quiet booths.', 'Facilities', 320000::numeric, 'institute'::issue_scope),
  ('Neighbourhood Pocket Park', 'Convert the vacant plot near the bus depot into a shaded pocket park with seating.', 'Public Space', 275000::numeric, 'civic'::issue_scope)
) AS seed(title, description, category, estimated_cost, scope)
WHERE NOT EXISTS (SELECT 1 FROM public.budget_proposals);