-- Migration: 003_landmarks
-- Creates the landmarks table for city-associated photographable landmarks.

CREATE TABLE IF NOT EXISTS public.landmarks (
  id                   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  landmark_id          text             NOT NULL UNIQUE,
  name                 text             NOT NULL,
  lat                  double precision NOT NULL,
  lng                  double precision NOT NULL,
  orientation_azimuth  double precision NOT NULL DEFAULT 0,
  location             text,
  city_slug            text             REFERENCES public.cities(slug) ON DELETE SET NULL,
  category             text             NOT NULL DEFAULT 'historic',
  image_gradient       text,
  created_at           timestamptz      NOT NULL DEFAULT now(),
  updated_at           timestamptz      NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_landmarks_city_slug ON public.landmarks (city_slug);
CREATE INDEX IF NOT EXISTS idx_landmarks_category ON public.landmarks (category);
CREATE INDEX IF NOT EXISTS idx_landmarks_landmark_id ON public.landmarks (landmark_id);

ALTER TABLE public.landmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landmarks FORCE ROW LEVEL SECURITY;

-- Public pages can read landmark records.
CREATE POLICY landmarks_select_public ON public.landmarks
  FOR SELECT
  USING (true);

-- Writes require a service role / admin token.
CREATE POLICY landmarks_write_service_only ON public.landmarks
  FOR ALL
  USING ((SELECT auth.role()) = 'service_role')
  WITH CHECK ((SELECT auth.role()) = 'service_role');
