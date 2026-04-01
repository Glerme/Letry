import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/security/rate-limit';

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await params;
  const rateLimit = await checkRateLimit({
    operation: 'api:signs:detail',
    request,
    keySuffix: slug,
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

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('signs')
    .select('slug, text, animation, led_color, bg_color, speed, loop_mode, restart_seconds, created_at')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Sign não encontrado' }, { status: 404 });
  }

  return NextResponse.json(data);
};
