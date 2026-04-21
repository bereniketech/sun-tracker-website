-- Migration: 20260421170000_create_user_landmarks
-- Creates the user_landmarks table for authenticated users to store custom alignment landmarks.
-- Each user can only access/modify their own landmarks via RLS policies.

CREATE TABLE IF NOT EXISTS public.user_landmarks (
  id        uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   uuid          NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  name      text          NOT NULL,
  lat       double precision NOT NULL,
  lng       double precision NOT NULL,
  notes     text,
  created_at timestamptz  NOT NULL DEFAULT now()
);

-- Fast per-user lookup
CREATE INDEX IF NOT EXISTS idx_user_landmarks_user_id ON public.user_landmarks (user_id);

-- Enable RLS (applied to table owners too via FORCE)
ALTER TABLE public.user_landmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_landmarks FORCE ROW LEVEL SECURITY;

-- Users can only select their own landmarks
CREATE POLICY user_landmarks_select ON public.user_landmarks
  FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

-- Users can only insert landmarks for themselves
CREATE POLICY user_landmarks_insert ON public.user_landmarks
  FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Users can only update their own landmarks
CREATE POLICY user_landmarks_update ON public.user_landmarks
  FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Users can only delete their own landmarks
CREATE POLICY user_landmarks_delete ON public.user_landmarks
  FOR DELETE
  USING ((SELECT auth.uid()) = user_id);
