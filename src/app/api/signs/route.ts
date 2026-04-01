import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const GET = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('signs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Erro ao buscar letreiros' }, { status: 500 });
  }

  return NextResponse.json(data);
};
