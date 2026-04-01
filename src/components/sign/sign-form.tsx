'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signSchema } from '@/lib/validations/sign';
import type { SignInput } from '@/lib/validations/sign';
import {
  ANIMATIONS,
  SPEEDS,
  DEFAULT_LED_COLOR,
  DEFAULT_BG_COLOR,
  DEFAULT_ANIMATION,
  DEFAULT_LOOP_MODE,
  DEFAULT_RESTART_SECONDS,
  DEFAULT_SPEED,
} from '@/lib/utils/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ColorPicker } from '@/components/ui/color-picker';
import { SignPreview } from './sign-preview';
import { ShareDialog } from './share-dialog';
import { createSign } from '@/app/(app)/create/actions';
import type { PlanTier } from '@/lib/billing/types';
import { UpgradeButton } from '@/components/billing/upgrade-button';

interface SignFormProps {
  planTier: PlanTier;
  signsCount: number;
}

const getAnimationLabel = (animation: (typeof ANIMATIONS)[number]): string =>
  animation === 'split-flap' ? 'Split-Flap' : animation.charAt(0).toUpperCase() + animation.slice(1);

const speedOptions = SPEEDS.map((s) => ({
  value: s,
  label: s === 'slow' ? 'Lento' : s === 'normal' ? 'Normal' : 'Rápido',
}));

const loopModeOptions = [
  { value: 'infinite', label: 'Loop infinito' },
  { value: 'restart', label: 'Reiniciar em X segundos' },
  { value: 'once', label: 'Animar 1 vez e congelar' },
] as const;

export const SignForm = ({ planTier, signsCount }: SignFormProps) => {
  const [shareSlug, setShareSlug] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [upgradeHint, setUpgradeHint] = useState<string | null>(null);
  const isFree = planTier === 'free';
  const hasFreeLimitReached = isFree && signsCount >= 1;

  const animationOptions = ANIMATIONS.map((animation) => {
    const isLocked = isFree && animation !== 'scroll';
    return {
      value: animation,
      label: isLocked ? `${getAnimationLabel(animation)} (Pro)` : getAnimationLabel(animation),
      disabled: isLocked,
    };
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignInput>({
    resolver: zodResolver(signSchema),
    defaultValues: {
      text: '',
      animation: DEFAULT_ANIMATION,
      led_color: DEFAULT_LED_COLOR,
      bg_color: DEFAULT_BG_COLOR,
      speed: DEFAULT_SPEED,
      loop_mode: DEFAULT_LOOP_MODE,
      restart_seconds: null,
    },
  });

  const watchedValues = useWatch({ control });
  const animationField = register('animation', {
    onChange: (event) => {
      if (isFree && event.target.value !== 'scroll') {
        setUpgradeHint('Esta animação é exclusiva do plano Pro.');
      } else {
        setUpgradeHint(null);
      }
    },
  });
  const isRestartMode = watchedValues.loop_mode === 'restart';

  useEffect(() => {
    if (!isRestartMode) {
      setValue('restart_seconds', null, { shouldValidate: true });
      return;
    }

    if (watchedValues.restart_seconds === null) {
      setValue('restart_seconds', DEFAULT_RESTART_SECONDS, { shouldValidate: true });
    }
  }, [isRestartMode, setValue, watchedValues.restart_seconds]);

  const onSubmit = async (data: SignInput) => {
    setServerError(null);
    setUpgradeHint(null);

    if (isFree && data.animation !== 'scroll') {
      setUpgradeHint('No plano grátis, apenas animação Scroll está disponível.');
      return;
    }

    if (hasFreeLimitReached) {
      setUpgradeHint('No plano grátis você pode ter apenas 1 letreiro ativo.');
      return;
    }

    const result = await createSign(data);
    if (result.success) {
      setShareSlug(result.slug);
    } else {
      setServerError(result.error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="cp-panel flex flex-col gap-5 rounded-xl border border-[var(--cp-border)] p-5"
        >
          <Input
            label="Texto do letreiro"
            placeholder="Digite seu texto..."
            error={errors.text?.message}
            {...register('text')}
          />

          <Select
            label="Animação"
            options={animationOptions}
            error={errors.animation?.message}
            {...animationField}
          />

          <Select
            label="Velocidade"
            options={speedOptions}
            error={errors.speed?.message}
            {...register('speed')}
          />

          <Select
            label="Loop da animação"
            options={loopModeOptions.map((mode) => ({ value: mode.value, label: mode.label }))}
            error={errors.loop_mode?.message}
            {...register('loop_mode')}
          />

          {isRestartMode && (
            <Input
              type="number"
              label="Segundos para reiniciar"
              min={1}
              max={120}
              step={1}
              error={errors.restart_seconds?.message}
              {...register('restart_seconds', {
                setValueAs: (value) => (value === '' ? null : Number(value)),
              })}
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <ColorPicker
              label="Cor do LED"
              error={errors.led_color?.message}
              {...register('led_color')}
            />
            <ColorPicker
              label="Cor do fundo"
              error={errors.bg_color?.message}
              {...register('bg_color')}
            />
          </div>

          {serverError && (
            <p className="text-sm text-red-400">{serverError}</p>
          )}

          {upgradeHint && (
            <p className="text-sm text-amber-300">{upgradeHint}</p>
          )}

          {isFree && (
            <div className="rounded-lg border border-[var(--cp-border)] bg-[rgba(10,14,30,0.65)] p-3 text-sm text-zinc-200">
              <p className="font-medium">Plano grátis: {Math.min(signsCount, 1)}/1 letreiro ativo</p>
              <p className="mt-1 text-zinc-300">Faça upgrade para liberar mais letreiros e todas as animações.</p>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <UpgradeButton className="w-full" fullWidth label="Pro mensal (Pix)" plan="pro_monthly_pix" />
                <UpgradeButton className="w-full" fullWidth label="Pro anual (Pix)" plan="pro_annual_pix" />
              </div>
            </div>
          )}

          <Button type="submit" loading={isSubmitting} className="w-full" disabled={hasFreeLimitReached}>
            Criar letreiro
          </Button>
        </form>

        {/* Live preview */}
        <div className="cp-panel flex flex-col gap-3 rounded-xl border border-[var(--cp-border)] p-5">
          <p className="cp-heading text-sm">Pré-visualização</p>
          <SignPreview
            text={watchedValues.text || 'LETRY'}
            animation={watchedValues.animation ?? DEFAULT_ANIMATION}
            ledColor={watchedValues.led_color ?? DEFAULT_LED_COLOR}
            bgColor={watchedValues.bg_color ?? DEFAULT_BG_COLOR}
            speed={watchedValues.speed ?? DEFAULT_SPEED}
            loopMode={watchedValues.loop_mode ?? DEFAULT_LOOP_MODE}
            restartSeconds={watchedValues.restart_seconds ?? null}
          />
        </div>
      </div>

      <ShareDialog
        slug={shareSlug}
        onClose={() => setShareSlug(null)}
      />
    </>
  );
};
