'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export type DeleteSignResult =
  | { success: true }
  | { success: false; error: string };

export const deleteSign = async (id: string): Promise<DeleteSignResult> => {
  if (!id) return { success: false, error: 'ID inválido' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Não autenticado' };

  const { error } = await supabase
    .from('signs')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // RLS also enforces this

  if (error) {
    return { success: false, error: 'Erro ao deletar letreiro' };
  }

  revalidatePath('/dashboard');
  return { success: true };
};
