'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { signIdSchema } from '@/lib/validations/sign';

export type DeleteSignResult =
  | { success: true }
  | { success: false; error: string };

export const deleteSign = async (id: string): Promise<DeleteSignResult> => {
  const parsedId = signIdSchema.safeParse(id);
  if (!parsedId.success) return { success: false, error: 'ID inválido' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Não autenticado' };

  const requestHeaders = await headers();
  const rateLimit = await checkRateLimit({
    operation: 'signs:delete',
    headersList: requestHeaders,
    userId: user.id,
  });

  if (!rateLimit.success) {
    return { success: false, error: 'Muitas tentativas. Tente novamente.' };
  }

  const { error } = await supabase
    .from('signs')
    .delete()
    .eq('id', parsedId.data)
    .eq('user_id', user.id); // RLS also enforces this

  if (error) {
    return { success: false, error: 'Erro ao deletar letreiro' };
  }

  revalidatePath('/dashboard');
  return { success: true };
};
