import { ImageResponse } from 'next/og';
import { createServerClient } from '@supabase/ssr';

export const runtime = 'edge';

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await params;

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

  const { data: sign } = await supabase
    .from('signs')
    .select('text, led_color, bg_color')
    .eq('slug', slug)
    .single();

  if (!sign) {
    return new Response('Not found', { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: sign.bg_color,
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
              color: sign.led_color,
              textAlign: 'center',
              textShadow: `0 0 20px ${sign.led_color}, 0 0 40px ${sign.led_color}`,
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
