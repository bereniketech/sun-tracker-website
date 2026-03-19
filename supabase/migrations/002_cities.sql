-- Migration: 002_cities
-- Creates the cities table used by SEO city pages.

CREATE TABLE IF NOT EXISTS public.cities (
  id               bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug             text          NOT NULL UNIQUE,
  name             text          NOT NULL,
  country          text          NOT NULL,
  lat              double precision NOT NULL,
  lng              double precision NOT NULL,
  timezone         text          NOT NULL,
  precomputed_data jsonb         NOT NULL DEFAULT '[]'::jsonb,
  updated_at       timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cities_country ON public.cities (country);
CREATE INDEX IF NOT EXISTS idx_cities_slug ON public.cities (slug);

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities FORCE ROW LEVEL SECURITY;

-- Public pages can read city records.
CREATE POLICY cities_select_public ON public.cities
  FOR SELECT
  USING (true);

-- Writes require a service role / admin token.
CREATE POLICY cities_write_service_only ON public.cities
  FOR ALL
  USING ((SELECT auth.role()) = 'service_role')
  WITH CHECK ((SELECT auth.role()) = 'service_role');
