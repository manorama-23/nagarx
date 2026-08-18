-- Add category column to grievances
ALTER TABLE public.grievances
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'Others';
