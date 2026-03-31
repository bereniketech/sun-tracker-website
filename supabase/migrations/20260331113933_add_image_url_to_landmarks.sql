-- Migration: add image_url column to landmarks
-- Stores cached Wikipedia thumbnail URL for each landmark.

ALTER TABLE public.landmarks ADD COLUMN IF NOT EXISTS image_url TEXT;
