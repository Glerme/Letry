import { z } from 'zod';

export const authSchema = z.object({
  email: z.email('Credenciais inválidas'),
  password: z.string().min(6, 'Credenciais inválidas'),
});

export type AuthInput = z.infer<typeof authSchema>;
