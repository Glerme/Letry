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

const animationOptions = ANIMATIONS.map((a) => ({
  value: a,
  label: a === 'split-flap' ? 'Split-Flap' : a.charAt(0).toUpperCase() + a.slice(1),
}));

const speedOptions = SPEEDS.map((s) => ({
  value: s,
  label: s === 'slow' ? 'Lento' : s === 'normal' ? 'Normal' : 'Rápido',
}));

const loopModeOptions = [
  { value: 'infinite', label: 'Loop infinito' },
  { value: 'restart', label: 'Reiniciar em X segundos' },
  { value: 'once', label: 'Animar 1 vez e congelar' },
] as const;

export const SignForm = () => {
  const [shareSlug, setShareSlug] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

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
            {...register('animation')}
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

          <Button type="submit" loading={isSubmitting} className="w-full">
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
