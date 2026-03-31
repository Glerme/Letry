'use client';

import { useState } from 'react';
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

export const SignForm = () => {
  const [shareSlug, setShareSlug] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignInput>({
    resolver: zodResolver(signSchema),
    defaultValues: {
      text: '',
      animation: DEFAULT_ANIMATION,
      led_color: DEFAULT_LED_COLOR,
      bg_color: DEFAULT_BG_COLOR,
      speed: DEFAULT_SPEED,
    },
  });

  const watchedValues = useWatch({ control });

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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-zinc-400">Pré-visualização</p>
          <SignPreview
            text={watchedValues.text || 'LETRY'}
            animation={watchedValues.animation ?? DEFAULT_ANIMATION}
            ledColor={watchedValues.led_color ?? DEFAULT_LED_COLOR}
            bgColor={watchedValues.bg_color ?? DEFAULT_BG_COLOR}
            speed={watchedValues.speed ?? DEFAULT_SPEED}
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
