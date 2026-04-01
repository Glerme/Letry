-- Run this once on existing projects that already created `public.signs`

ALTER TABLE public.signs
  ADD COLUMN loop_mode VARCHAR(12) NOT NULL DEFAULT 'infinite',
  ADD COLUMN restart_seconds SMALLINT NULL;

ALTER TABLE public.signs
  ADD CONSTRAINT signs_loop_mode_check CHECK (loop_mode IN ('infinite', 'restart', 'once')),
  ADD CONSTRAINT signs_restart_seconds_range_check CHECK (
    restart_seconds IS NULL OR (restart_seconds BETWEEN 1 AND 120)
  ),
  ADD CONSTRAINT signs_restart_seconds_mode_check CHECK (
    (loop_mode = 'restart' AND restart_seconds IS NOT NULL)
    OR (loop_mode <> 'restart' AND restart_seconds IS NULL)
  );
