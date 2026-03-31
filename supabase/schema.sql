-- supabase/schema.sql
-- Run this in the Supabase Dashboard > SQL Editor

CREATE TABLE public.signs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug        VARCHAR(12) UNIQUE NOT NULL,
  text        VARCHAR(200) NOT NULL,
  animation   VARCHAR(20) NOT NULL DEFAULT 'scroll',
  led_color   VARCHAR(7) NOT NULL DEFAULT '#ff6600',
  bg_color    VARCHAR(7) NOT NULL DEFAULT '#111111',
  speed       VARCHAR(10) NOT NULL DEFAULT 'normal',
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx_signs_slug ON signs(slug);
CREATE INDEX idx_signs_user_id ON signs(user_id) WHERE user_id IS NOT NULL;

ALTER TABLE signs ENABLE ROW LEVEL SECURITY;

-- Anyone can read any sign (public display)
CREATE POLICY "Signs are public for reading"
  ON signs FOR SELECT
  USING (true);

-- Anyone can create a sign (anonymous or authenticated)
CREATE POLICY "Anyone can create signs"
  ON signs FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Only owner can update their sign
CREATE POLICY "Owner can update their sign"
  ON signs FOR UPDATE
  USING (auth.uid() = user_id);

-- Only owner can delete their sign
CREATE POLICY "Owner can delete their sign"
  ON signs FOR DELETE
  USING (auth.uid() = user_id);
