-- Run this on existing projects to enable Free/Pro monetization rules

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_tier VARCHAR(10) NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free', 'pro')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'past_due', 'canceled')),
  provider VARCHAR(40) NOT NULL DEFAULT 'abacate_pay',
  provider_reference TEXT NOT NULL,
  current_period_end TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_provider_reference
  ON public.user_subscriptions(provider_reference);

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_user_subscriptions_touch_updated_at ON public.user_subscriptions;
CREATE TRIGGER trg_user_subscriptions_touch_updated_at
BEFORE UPDATE ON public.user_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.enforce_sign_plan_limits()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  user_sign_count INTEGER;
  sub_record RECORD;
  has_active_pro BOOLEAN := false;
BEGIN
  IF NEW.user_id IS NULL THEN
    RAISE EXCEPTION 'Faça login para criar letreiros.';
  END IF;

  SELECT plan_tier, status, current_period_end
  INTO sub_record
  FROM public.user_subscriptions
  WHERE user_id = NEW.user_id
  ORDER BY updated_at DESC
  LIMIT 1;

  IF sub_record IS NOT NULL THEN
    has_active_pro :=
      sub_record.plan_tier = 'pro'
      AND sub_record.status = 'active'
      AND sub_record.current_period_end IS NOT NULL
      AND sub_record.current_period_end > now();
  END IF;

  IF NOT has_active_pro THEN
    IF NEW.animation <> 'scroll' THEN
      RAISE EXCEPTION 'Animação disponível apenas no plano Pro.';
    END IF;

    SELECT count(*) INTO user_sign_count
    FROM public.signs
    WHERE user_id = NEW.user_id;

    IF user_sign_count >= 1 THEN
      RAISE EXCEPTION 'No plano grátis você pode ter apenas 1 letreiro ativo.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_signs_enforce_plan_limits ON public.signs;
CREATE TRIGGER trg_signs_enforce_plan_limits
BEFORE INSERT ON public.signs
FOR EACH ROW
EXECUTE FUNCTION public.enforce_sign_plan_limits();

DROP POLICY IF EXISTS "Anyone can create signs" ON public.signs;
DROP POLICY IF EXISTS "Authenticated users can create signs" ON public.signs;
CREATE POLICY "Authenticated users can create signs"
  ON public.signs FOR INSERT
  WITH CHECK (auth.uid() = user_id);
