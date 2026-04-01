import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/security/rate-limit';

export const GET = async (request: Request) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const rateLimit = await checkRateLimit({
    operation: 'api:signs:list',
    request,
    userId: user.id,
  });
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Muitas requisições. Tente novamente.' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
      }
    );
  }

  const { data, error } = await supabase
    .from('signs')
    .select('id, slug, text, animation, led_color, bg_color, speed, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Erro ao buscar letreiros' }, { status: 500 });
  }

  return NextResponse.json(data);
};
