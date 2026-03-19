-- Migration: 001_favorites
-- Creates the favorites table with RLS policies so each user can only
-- access their own rows.

CREATE TABLE IF NOT EXISTS public.favorites (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    uuid          NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  name       text          NOT NULL,
  lat        numeric(9, 6) NOT NULL,
  lng        numeric(9, 6) NOT NULL,
  created_at timestamptz   NOT NULL DEFAULT now()
);

-- Fast per-user lookup
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites (user_id);

-- Enable RLS (applied to table owners too via FORCE)
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites FORCE ROW LEVEL SECURITY;

-- Wrap auth.uid() in a SELECT subquery to avoid per-row re-evaluation
CREATE POLICY favorites_select ON public.favorites
  FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY favorites_insert ON public.favorites
  FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY favorites_delete ON public.favorites
  FOR DELETE
  USING ((SELECT auth.uid()) = user_id);
