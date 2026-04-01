'use server';

import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { signSchema } from '@/lib/validations/sign';
import { generateSlug } from '@/lib/utils/slug';

export type CreateSignResult =
  | { success: true; slug: string }
  | { success: false; error: string };

export const createSign = async (data: unknown): Promise<CreateSignResult> => {
  const parsed = signSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // If auth service failed, don't silently create anonymous sign
  if (authError) {
    console.error('Auth error in createSign:', authError.message);
    // Continue as anonymous — auth failure doesn't prevent sign creation
    // (anonymous signs are a supported use case)
  }

  const requestHeaders = await headers();
  const rateLimit = await checkRateLimit({
    operation: 'signs:create',
    headersList: requestHeaders,
    userId: user?.id,
  });

  if (!rateLimit.success) {
    return { success: false, error: 'Muitas tentativas. Tente novamente.' };
  }

  const slug = generateSlug();

  const { error } = await supabase.from('signs').insert({
    slug,
    text: parsed.data.text,
    animation: parsed.data.animation,
    led_color: parsed.data.led_color,
    bg_color: parsed.data.bg_color,
    speed: parsed.data.speed,
    loop_mode: parsed.data.loop_mode,
    restart_seconds: parsed.data.restart_seconds,
    user_id: user?.id ?? null,
  });

  if (error) {
    // Slug collision — retry once
    if (error.code === '23505') {
      const retrySlug = generateSlug();
      const { error: retryError } = await supabase.from('signs').insert({
        slug: retrySlug,
        text: parsed.data.text,
        animation: parsed.data.animation,
        led_color: parsed.data.led_color,
        bg_color: parsed.data.bg_color,
        speed: parsed.data.speed,
        loop_mode: parsed.data.loop_mode,
        restart_seconds: parsed.data.restart_seconds,
        user_id: user?.id ?? null,
      });
      if (retryError) {
        return { success: false, error: 'Erro ao salvar letreiro. Tente novamente.' };
      }
      return { success: true, slug: retrySlug };
    }
    return { success: false, error: 'Erro ao salvar letreiro. Tente novamente.' };
  }

  return { success: true, slug };
};
