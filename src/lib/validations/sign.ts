import { z } from 'zod';
import { ANIMATIONS, SPEEDS } from '@/lib/utils/constants';

export const signSchema = z.object({
  text: z.string().min(1, 'Texto é obrigatório').max(200, 'Máximo 200 caracteres'),
  animation: z.enum(ANIMATIONS),
  led_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Cor inválida'),
  bg_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Cor inválida'),
  speed: z.enum(SPEEDS),
});

export type SignInput = z.infer<typeof signSchema>;

export type Sign = SignInput & {
  id: string;
  slug: string;
  user_id: string | null;
  created_at: string;
};
