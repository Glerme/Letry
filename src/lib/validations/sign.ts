import { z } from 'zod';
import { ANIMATIONS, SPEEDS } from '@/lib/utils/constants';

export const signSchema = z.object({
  text: z.string().min(1, 'Texto é obrigatório').max(200, 'Máximo 200 caracteres'),
  animation: z.enum(ANIMATIONS),
  led_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Cor inválida'),
  bg_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Cor inválida'),
  speed: z.enum(SPEEDS),
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
