import { ImageResponse } from 'next/og';
import { createServerClient } from '@supabase/ssr';
import { checkRateLimit } from '@/lib/security/rate-limit';

export const runtime = 'edge';

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await params;
  const rateLimit = await checkRateLimit({
    operation: 'api:og:detail',
    request,
    keySuffix: slug,
  });

  if (!rateLimit.success) {
    return new Response('Too Many Requests', {
      status: 429,
      headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
    });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  );

  const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;
  const safeColor = (value: string, fallback: string) =>
    HEX_COLOR_RE.test(value) ? value : fallback;

  const { data: sign, error } = await supabase
    .from('signs')
    .select('text, led_color, bg_color')
    .eq('slug', slug)
    .single();

  if (error || !sign) {
    return new Response('Not found', { status: 404 });
  }

  const ledColor = safeColor(sign.led_color, '#ff6600');
  const bgColor = safeColor(sign.bg_color, '#111111');

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: bgColor,
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: ledColor,
              textAlign: 'center',
              textShadow: `0 0 20px ${ledColor}, 0 0 40px ${ledColor}`,
              maxWidth: '1000px',
            }}
          >
            {sign.text}
          </div>
          <div
            style={{
              fontSize: '20px',
              color: '#a1a1aa',
            }}
          >
            letry.app
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
};
