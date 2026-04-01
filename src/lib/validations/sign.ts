import { z } from 'zod';
import { ANIMATIONS, LOOP_MODES, SPEEDS } from '@/lib/utils/constants';

export const signSchema = z.object({
  text: z.string().min(1, 'Texto é obrigatório').max(200, 'Máximo 200 caracteres'),
  animation: z.enum(ANIMATIONS),
  led_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Cor inválida'),
  bg_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Cor inválida'),
  speed: z.enum(SPEEDS),
  loop_mode: z.enum(LOOP_MODES),
  restart_seconds: z.number().int().min(1).max(120).nullable(),
}).superRefine((data, ctx) => {
  if (data.loop_mode === 'restart' && data.restart_seconds === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['restart_seconds'],
      message: 'Informe os segundos para reiniciar.',
    });
  }

  if (data.loop_mode !== 'restart' && data.restart_seconds !== null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['restart_seconds'],
      message: 'Só use segundos quando o modo for reinício.',
    });
  }
});

export const signIdSchema = z.string().uuid('ID inválido');

export type SignInput = z.infer<typeof signSchema>;

export type PublicSign = SignInput & {
  slug: string;
  created_at: string;
};

export type OwnedSign = PublicSign & {
  id: string;
};

export type SignRecord = OwnedSign & {
  user_id: string | null;
};
